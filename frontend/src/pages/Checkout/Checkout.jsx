import { useState } from "react";
import { getCartTotal } from "../../utils/cart";
import "./Checkout.css";

function Checkout({ cart, onPlaceOrder }) {
  const total = getCartTotal(cart);
  const [payment, setPayment] = useState("UPI");
  const paymentMethods = [
    { name: "UPI", icon: "UPI" },
    { name: "Debit/Credit Card", icon: "CARD" },
    { name: "Net Banking", icon: "BANK" }
  ];

  return (
    <main className="page checkout-page">
      <div className="checkout-form">
        <p className="blue-text">Payment UI</p>
        <h1>Checkout</h1>
        <input placeholder="Full Name" />
        <input placeholder="Phone Number" />
        <textarea placeholder="Address"></textarea>

        <h2>Payment Method</h2>
        <div className="payment-grid">
          {paymentMethods.map((item) => (
            <button
              className={payment === item.name ? "payment-card selected-payment" : "payment-card"}
              key={item.name}
              onClick={() => setPayment(item.name)}
            >
              <span className="payment-radio">{payment === item.name ? "●" : ""}</span>
              <span className="payment-icon">{item.icon}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>

        {payment === "UPI" && <input placeholder="UPI ID (Demo)" />}
        {payment === "Debit/Credit Card" && <input placeholder="Card Number (Demo)" />}
        {payment === "Net Banking" && <input placeholder="Bank Name (Demo)" />}

        <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
        <button onClick={() => onPlaceOrder(payment)}>Place Order</button>
      </div>
    </main>
  );
}

export default Checkout;
