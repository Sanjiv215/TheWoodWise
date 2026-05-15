import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import { deleteAccount, getAccountData, logoutAccount, saveAccountData } from "./services/accountService";
import { getCartCount, normalizeCart } from "./utils/cart";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const SESSION_KEY = "woodwise_session";

function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.token && session?.user ? session : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function saveSession(user, token) {
  if (!user || !token) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
}

function App() {
  const navigate = useNavigate();
  const savedSession = loadSession();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(savedSession.user);
  const [token, setToken] = useState(savedSession.token);
  const [accountReady, setAccountReady] = useState(!savedSession.token);
  const [toast, setToast] = useState("");

  const normalizedCart = normalizeCart(cart);
  const cartCount = getCartCount(normalizedCart);
  const cartIds = new Set(normalizedCart.map((item) => item.id));
  const wishlistIds = new Set(wishlist.map((item) => item.id));

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      if (!token) {
        setAccountReady(true);
        return;
      }

      try {
        const data = await getAccountData(token);
        if (cancelled) return;

        setOrders(data.orders || []);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          saveSession(null, null);
          showToast("Please login again");
        }
      } finally {
        if (!cancelled) setAccountReady(true);
      }
    }

    setAccountReady(!token);
    loadAccount();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !accountReady) return;

    saveAccountData(token, {
      orders,
    }).catch(() => showToast("Could not sync account data"));
  }, [token, accountReady, orders]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function toggleCart(product, quantity = 1) {
    setCart((currentCart) => {
      const normalized = normalizeCart(currentCart);
      const exists = normalized.some((item) => item.id === product.id);
      if (exists) return normalized.filter((item) => item.id !== product.id);
      return [...normalized, { ...product, quantity }];
    });
    showToast(cartIds.has(product.id) ? "Removed from cart" : "Added to cart");
  }

  function addToCart(product, quantity = 1) {
    setCart((currentCart) => {
      const normalized = normalizeCart(currentCart);
      const existing = normalized.find((item) => item.id === product.id);
      if (!existing) return [...normalized, { ...product, quantity }];
      return normalized.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
    });
    showToast("Added to cart");
  }

  function removeFromCart(id) {
    setCart((currentCart) => normalizeCart(currentCart).filter((item) => item.id !== id));
    showToast("Removed from cart");
  }

  function updateCartQuantity(id, quantity) {
    setCart((currentCart) => normalizeCart(currentCart).map((item) => (
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )));
  }

  function toggleWishlist(product) {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => item.id === product.id);
      if (exists) return currentWishlist.filter((item) => item.id !== product.id);
      return [...currentWishlist, product];
    });
    showToast(wishlistIds.has(product.id) ? "Removed from wishlist" : "Added to wishlist");
  }

  async function signup({ name, email, password, otp }) {
    if (name === "" || email === "" || password.length < 4) {
      showToast("Please fill all fields");
      return false;
    }

    try {
      if (otp) {
        await axios.post(`${API_URL}/signup/verify`, { email, otp });
        showToast("Signup successful");
        navigate("/login");
      } else {
        await axios.post(`${API_URL}/signup/send-otp`, { name, email, password });
        showToast("OTP sent to your email");
      }

      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed");
      return false;
    }
  }

  async function login(email, password) {
    if (email === "" || password === "") {
      showToast("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const accountData = res.data.data || {};
      const nextOrders = accountData.orders?.length ? accountData.orders : orders;

      setAccountReady(false);
      setUser(res.data.user);
      setToken(res.data.token);
      saveSession(res.data.user, res.data.token);
      setOrders(nextOrders);
      setAccountReady(true);
      showToast("Login successful");
      navigate("/profile");
    } catch (error) {
      showToast(error.response?.data?.message || "Invalid credentials");
    }
  }

  async function logout() {
    await logoutAccount(token);
    setToken(null);
    setUser(null);
    saveSession(null, null);
    showToast("Logged out");
    navigate("/");
  }

  async function removeAccount() {
    if (!token || !window.confirm("Delete your account permanently? This cannot be undone.")) return;

    try {
      await deleteAccount(token);
      setToken(null);
      setUser(null);
      saveSession(null, null);
      setCart([]);
      setWishlist([]);
      setOrders([]);
      showToast("Account deleted");
      navigate("/");
    } catch {
      showToast("Could not delete account");
    }
  }

  async function placeOrder(paymentMode) {
    if (!user || !token) {
      showToast("Please login before placing an order");
      navigate("/login");
      return;
    }

    if (normalizedCart.length === 0) {
      showToast("Cart is empty");
      return;
    }

    const now = new Date();
    const newOrders = normalizedCart.map((item) => ({
      product: item.title,
      id: item.id,
      price: item.price,
      paymentMode,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    }));
    const nextOrders = [...newOrders, ...orders];
    const nextData = {
      orders: nextOrders,
    };

    try {
      await saveAccountData(token, nextData);
    } catch {
      showToast("Order could not be saved");
      return;
    }

    setOrders(nextOrders);
    setCart([]);
    showToast("Order placed");
    navigate("/orders");
  }

  const commerceProps = {
    cartIds,
    wishlistIds,
    onAddCart: addToCart,
    onToggleCart: toggleCart,
    onToggleWishlist: toggleWishlist
  };

  return (
    <>
      <Navbar cartCount={cartCount} wishCount={wishlist.length} user={user} onLogout={logout} />

      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route path="/" element={<Home {...commerceProps} />} />
        <Route path="/products" element={<Products {...commerceProps} />} />
        <Route path="/product/:id" element={<ProductDetail {...commerceProps} />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} {...commerceProps} />} />
        <Route
          path="/cart"
          element={(
            <Cart
              cart={normalizedCart}
              onRemoveCart={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
            />
          )}
        />
        <Route
          path="/checkout"
          element={(
            <Checkout
              cart={normalizedCart}
              onPlaceOrder={placeOrder}
            />
          )}
        />
        <Route path="/orders" element={<Orders orders={orders} />} />
        <Route
          path="/profile"
          element={(
            <Profile
              user={user}
              cart={normalizedCart}
              wishlist={wishlist}
              orders={orders}
              onLogout={logout}
              onDeleteAccount={removeAccount}
            />
          )}
        />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/signup" element={<Signup onSignup={signup} />} />
        <Route path="/forgot-password" element={<ForgotPassword showToast={showToast} />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
