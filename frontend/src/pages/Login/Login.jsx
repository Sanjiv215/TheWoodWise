import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Please enter email and password.");
      return;
    }

    setError("");
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  }

  return (
    <main className="auth-page">

      <section className="auth-art">
        <p className="blue-text">The WoodWise</p>
        <h1>Welcome back to your blue showroom.</h1>
        <p>Save furniture, track orders and build your dream home collection.</p>
      </section>

      <section className="auth-form-side">

        <form className="glass-form" onSubmit={handleSubmit}>

          <p className="blue-text">Welcome Back</p>
          <h1>Login</h1>

          {error && <p className="auth-error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <div className="password-row">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>

          <Link to="/forgot-password">Forgot password?</Link>

          <p>
            New user? <Link to="/signup">Create account</Link>
          </p>

        </form>

      </section>

    </main>
  );
}

export default Login;