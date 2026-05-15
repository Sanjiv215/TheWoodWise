import { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function ForgotPassword({ showToast }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function sendReset(e) {
    e.preventDefault();

    if (email === "") {
      setError("Please enter email");
      return;
    }

    if (otpSent && (otp.trim().length !== 6 || password.length < 4)) {
      setError("Enter the 6 digit OTP and a password with at least 4 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (otpSent) {
        await axios.post(`${API_URL}/password/reset`, { email, otp, password });
        showToast("Password reset successful");
        setEmail("");
        setOtp("");
        setPassword("");
        setOtpSent(false);
      } else {
        await axios.post(`${API_URL}/password/forgot`, { email });
        showToast("OTP sent to your email");
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page form-page">
      <form className="glass-form" onSubmit={sendReset}>
        <p className="blue-text">Reset</p>
        <h1>Forgot Password</h1>
        {error && <p className="auth-error">{error}</p>}
        {otpSent && <p className="auth-success">OTP sent. Enter it below with your new password.</p>}
        <input type="email" placeholder="Enter your email" value={email} disabled={otpSent} onChange={(e) => setEmail(e.target.value)} />
        {otpSent && (
          <>
            <input
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
        <button disabled={submitting}>{submitting ? "Please wait..." : otpSent ? "Reset Password" : "Send OTP"}</button>
        {otpSent && (
          <button
            className="link-button"
            type="button"
            disabled={submitting}
            onClick={() => {
              setOtp("");
              setPassword("");
              setOtpSent(false);
            }}
          >
            Change email
          </button>
        )}
      </form>
    </main>
  );
}

export default ForgotPassword;
