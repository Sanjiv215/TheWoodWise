import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (name === "" || email === "" || password.length < 4) {
      setError("Please fill all fields. Password needs 4 characters.");
      return;
    }
    setError("");
    onSignup(name, email, password);
  }

  return (
    <main className="auth-page">
      <section className="auth-art signup-art">
        <p className="blue-text">Start Fresh</p>
        <h1>Create a calm home with smarter furniture picks.</h1>
        <p>Make an account to save wishlist items, cart pieces and demo orders.</p>
      </section>

      <section className="auth-form-side">
        <form className="glass-form" onSubmit={handleSubmit}>
          <p className="blue-text">Join Us</p>
          <h1>Signup</h1>
          {error && <p className="auth-error">{error}</p>}
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="password-row">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
          </div>
          <button>Create Account</button>
          <p>Already have account? <Link to="/login">Login</Link></p>
        </form>
      </section>
    </main>
  );
}

export default Signup;
