import { useState } from "react";
import "./OtpVerification.css";

function OtpVerification({ onVerifyOtp }) {
  const [otp, setOtp] = useState("");

  return (
    <main className="page form-page">
      <div className="glass-form">
        <p className="blue-text">Demo OTP</p>
        <h1>Verify OTP</h1>
        <p>Enter 1234 to verify your account.</p>
        <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={() => onVerifyOtp(otp)}>Verify</button>
      </div>
    </main>
  );
}

export default OtpVerification;
