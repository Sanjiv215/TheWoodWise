import { Link } from "react-router-dom";
import { getCartCount, getCartTotal } from "../../utils/cart";
import "./Cart.css";

function Cart({ cart, onRemoveCart, onUpdateQuantity }) {
  const total = getCartTotal(cart);
  const count = getCartCount(cart);

  return (
    <main className="page">
      <div className="page-title">
        <p className="blue-text">Basket</p>
        <h1>Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-box">Your cart is empty.</div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((item, index) => (
              <div className="cart-item" key={item.id || index}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div>
                  <h3>{item.title}</h3>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>
                  <div className="cart-quantity">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <strong>{item.quantity}</strong>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => onRemoveCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="summary-box">
            <h2>Order Summary</h2>
            <p>Total Items: {count}</p>
            <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
            <Link className="main-btn" to="/checkout">Checkout</Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
