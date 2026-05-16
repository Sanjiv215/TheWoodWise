import { useMemo, useState } from "react";
import { getCartTotal } from "../../utils/cart";
import "./Checkout.css";

const MERCHANT_UPI_ID = import.meta.env.VITE_MERCHANT_UPI_ID || "sanjivprasad360-1@okicici";
const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_NAME || "TheWoodWise";

function Checkout({ cart, onPlaceOrder }) {
  const total = getCartTotal(cart);

  const [payment, setPayment] = useState("UPI");
  const [paid, setPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const orderNote = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const customer = fullName.trim() || "Customer";
    return `WoodWise order for ${customer} (${itemCount} item${itemCount === 1 ? "" : "s"})`;
  }, [cart, fullName]);
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: MERCHANT_NAME,
      am: total.toFixed(2),
      cu: "INR",
      tn: orderNote,
    });

    return `upi://pay?${params.toString()}`;
  }, [orderNote, total]);
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiLink)}`;

  const paymentMethods = [
    { name: "UPI", icon: "UPI" },
    { name: "Cash on Delivery", icon: "COD" }
  ];

  const handleOrder = () => {
    if (!fullName || !phone || !address) {
      alert("Please fill all required fields.");
      return;
    }

    if (payment === "UPI" && !transactionId.trim()) {
      alert("Please enter transaction ID");
      return;
    }

    onPlaceOrder(payment === "UPI" ? `UPI paid - Ref ${transactionId.trim()}` : payment);
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
              onClick={() => {
                setPayment(item.name);
                setPaid(false);
                setTransactionId("");
              }}
            >
              <span className="payment-radio">
                {payment === item.name ? "●" : ""}
              </span>

              <span className="payment-icon">{item.icon}</span>

              <strong>{item.name}</strong>
            </button>
          ))}
        </div>

        {payment === "UPI" && (
          <div className="qr-payment-panel">
            <div className="qr-box">
              <img src={qrUrl} alt="UPI QR" />
            </div>
            <div className="qr-details">
              <p>Scan to pay</p>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
              <span>{MERCHANT_UPI_ID}</span>
              <small>{orderNote}</small>
            </div>
            <button className="paid-button" type="button" onClick={() => setPaid(true)}>
              I Have Paid
            </button>
            {paid && (
              <>
                <input
                  className="upi-reference-input"
                  placeholder="Enter Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <button type="button" onClick={handleOrder}>
                  Confirm Order
                </button>
              </>
            )}
          </div>
        )}

        {payment === "Cash on Delivery" && (
          <div className="cod-payment-panel">
            <strong>Pay when your order arrives</strong>
            <span>No online payment needed for this order.</span>
          </div>
        )}

        <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>

        {payment === "Cash on Delivery" && <button onClick={handleOrder}>Place COD Order</button>}
      </div>
    </main>
  );
}

export default Checkout;
