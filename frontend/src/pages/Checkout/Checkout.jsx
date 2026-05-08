import { useState } from "react";
import "./Checkout.css";

function Checkout({ cart, onPlaceOrder }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const [pinCode, setPinCode] = useState("");
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("UPI");
  const paymentMethods = [
    { name: "UPI", icon: "UPI" },
    { name: "Cash on Delivery", icon: "COD" },
    { name: "Debit/Credit Card", icon: "CARD" },
    { name: "Net Banking", icon: "BANK" }
  ];

  function checkPinCode() {
    if (pinCode.length < 5) {
      setDelivery("Enter a valid pin code.");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + 5);
    const text = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
    setDelivery(`Delivery by ${text}`);
  }

  return (
    <main className="page checkout-page">
      <div className="checkout-form">
        <p className="blue-text">Payment UI</p>
        <h1>Checkout</h1>
        <input placeholder="Full Name" />
        <input placeholder="Phone Number" />
        <textarea placeholder="Delivery Address"></textarea>

        <div className="pin-row">
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter PIN code" />
          <button onClick={checkPinCode}>Check</button>
        </div>
        {delivery && <p className="delivery-text">{delivery}</p>}

        <h2>Payment Method</h2>
        <div className="payment-grid">
          {paymentMethods.map((item) => (
            <button
              className={payment === item.name ? "payment-card selected-payment" : "payment-card"}
              key={item.name}
              onClick={() => setPayment(item.name)}
            >
              <span>{item.icon}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>

        {payment === "UPI" && <input placeholder="UPI ID (Demo)" />}
        {payment === "Debit/Credit Card" && <input placeholder="Card Number (Demo)" />}
        {payment === "Net Banking" && <input placeholder="Bank Name (Demo)" />}
        {payment === "Cash on Delivery" && <p className="cod-note">Pay when your furniture arrives.</p>}

        <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
        <button onClick={onPlaceOrder}>Place Demo Order</button>
      </div>
    </main>
  );
}

export default Checkout;
