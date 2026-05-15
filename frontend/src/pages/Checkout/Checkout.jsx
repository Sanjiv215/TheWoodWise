import { useState } from "react";
import { getCartTotal } from "../../utils/cart";
import "./Checkout.css";

function Checkout({ cart, onPlaceOrder }) {
  const total = getCartTotal(cart);

  const [payment, setPayment] = useState("UPI");

  // form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const paymentMethods = [
    { name: "UPI", icon: "UPI" },
    { name: "Debit/Credit Card", icon: "CARD" },
    { name: "Net Banking", icon: "BANK" }
  ];

  const handleOrder = () => {
    if (!fullName || !phone || !address) {
      alert("Please fill all required fields.");
      return;
    }

    onPlaceOrder(payment);
  };

  return (
    <main className="page checkout-page">
      <div className="checkout-form">
        <p className="blue-text">Payment UI</p>
        <h1>Checkout</h1>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>

        <h2>Payment Method</h2>

        <div className="payment-grid">
          {paymentMethods.map((item) => (
            <button
              type="button"
              className={
                payment === item.name
                  ? "payment-card selected-payment"
                  : "payment-card"
              }
              key={item.name}
              onClick={() => setPayment(item.name)}
            >
              <span className="payment-radio">
                {payment === item.name ? "●" : ""}
              </span>

              <span className="payment-icon">{item.icon}</span>

              <strong>{item.name}</strong>
            </button>
          ))}
        </div>

        {payment === "UPI" && <input placeholder="UPI ID (Demo)" />}

        {payment === "Debit/Credit Card" && (
          <input placeholder="Card Number (Demo)" />
        )}

        {payment === "Net Banking" && (
          <input placeholder="Bank Name (Demo)" />
        )}

        <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>

        <button onClick={handleOrder}>Place Order</button>
      </div>
    </main>
  );
}

export default Checkout;