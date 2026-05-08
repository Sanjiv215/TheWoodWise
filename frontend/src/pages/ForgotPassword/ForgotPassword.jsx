import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword({ showToast }) {
  const [email, setEmail] = useState("");

  function sendReset(e) {
    e.preventDefault();
    if (email === "") {
      showToast("Please enter email");
      return;
    }
    showToast("Demo reset link sent");
    setEmail("");
  }

  return (
    <main className="page form-page">
      <form className="glass-form" onSubmit={sendReset}>
        <p className="blue-text">Reset</p>
        <h1>Forgot Password</h1>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button>Send Reset Link</button>
      </form>
    </main>
  );
}

export default ForgotPassword;
