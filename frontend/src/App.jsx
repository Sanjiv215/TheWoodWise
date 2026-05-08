import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";
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
import OtpVerification from "./pages/OtpVerification/OtpVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import "./App.css";

function getSavedData(name, defaultValue) {
  const saved = localStorage.getItem(name);
  return saved ? JSON.parse(saved) : defaultValue;
}

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getSavedData("wood_cart", []));
  const [wishlist, setWishlist] = useState(() => getSavedData("wood_wishlist", []));
  const [orders, setOrders] = useState(() => getSavedData("wood_orders", []));
  const [user, setUser] = useState(() => getSavedData("wood_user", null));
  const [toast, setToast] = useState("");
  const API_URL = "http://localhost:5000/api/auth";

  useEffect(() => localStorage.setItem("wood_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wood_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("wood_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("wood_user", JSON.stringify(user)), [user]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function addToCart(product) {
    const productForCart = { ...product, cartId: Date.now() };
    setCart([...cart, productForCart]);
    showToast("Added to cart");
  }

  function addToWishlist(product) {
    const alreadyAdded = wishlist.find((item) => item.id === product.id);
    if (alreadyAdded) {
      showToast("Already in wishlist");
      return;
    }
    setWishlist([...wishlist, product]);
    showToast("Added to wishlist");
  }

  function removeFromWishlist(id) {
    setWishlist(wishlist.filter((item) => item.id !== id));
    showToast("Removed from wishlist");
  }

  function removeFromCart(index) {
    setCart(cart.filter((item, itemIndex) => itemIndex !== index));
    showToast("Removed from cart");
  }

  async function signup(name, email, password) {
    if (name === "" || email === "" || password.length < 4) {
      showToast("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        name: name,
        email: email,
        password: password
      });
      showToast(res.data.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed");
    }
  }

  function verifyOtp(otp) {
    if (otp === "1234") {
      showToast("OTP verified. Please login");
      navigate("/login");
    } else {
      showToast("Wrong OTP. Try 1234");
    }
  }

  async function login(email, password) {
    if (email === "" || password === "") {
      showToast("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });
      localStorage.setItem("wood_token", res.data.token);
      setUser(res.data.user);
      showToast(res.data.message || "Login successful");
      navigate("/");
    } catch (error) {
      showToast(error.response?.data?.message || "Invalid credentials");
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("wood_token");
    showToast("Logged out");
    navigate("/");
  }

  function placeOrder() {
    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: cart,
      total: total
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    showToast("Demo order placed");
    navigate("/orders");
  }

  return (
    <>
      <Navbar cartCount={cart.length} wishCount={wishlist.length} user={user} onLogout={logout} />

      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route path="/" element={<Home onAddCart={addToCart} onAddWishlist={addToWishlist} />} />
        <Route path="/products" element={<Products onAddCart={addToCart} onAddWishlist={addToWishlist} />} />
        <Route path="/product/:id" element={<ProductDetail onAddCart={addToCart} onAddWishlist={addToWishlist} />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} onAddCart={addToCart} onAddWishlist={addToWishlist} onRemoveWishlist={removeFromWishlist} />} />
        <Route path="/cart" element={<Cart cart={cart} onRemoveCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} onPlaceOrder={placeOrder} />} />
        <Route path="/orders" element={<Orders orders={orders} />} />
        <Route path="/profile" element={<Profile user={user} cart={cart} wishlist={wishlist} orders={orders} onLogout={logout} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/signup" element={<Signup onSignup={signup} />} />
        <Route path="/otp-verification" element={<OtpVerification onVerifyOtp={verifyOtp} />} />
        <Route path="/forgot-password" element={<ForgotPassword showToast={showToast} />} />
      </Routes>

      <Chatbot />
      <Footer />
    </>
  );
}

export default App;
