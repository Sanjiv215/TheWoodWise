import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({ cart, onRemoveCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
              <div className="cart-item" key={item.cartId || index}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>
                </div>
                <button className="remove-btn" onClick={() => onRemoveCart(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="summary-box">
            <h2>Order Summary</h2>
            <p>Total Items: {cart.length}</p>
            <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
            <Link className="main-btn" to="/checkout">Checkout</Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
