import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Icon({ name }) {
  if (name === "logo") return <svg viewBox="0 0 24 24"><path d="M4 19V8l8-4 8 4v11" /><path d="M8 19v-8h8v8" /><path d="M10 14h4" /></svg>;
  if (name === "products") return <svg viewBox="0 0 24 24"><path d="M4 7h16" /><path d="M7 7v13" /><path d="M17 7v13" /><path d="M4 20h16" /><path d="M9 11h6" /></svg>;
  if (name === "heart") return <svg viewBox="0 0 24 24"><path d="M20.8 5.6a5.4 5.4 0 0 0-7.6 0L12 6.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" /></svg>;
  if (name === "cart") return <svg viewBox="0 0 24 24"><path d="M6 6h15l-2 9H8L6 6Z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>;
  if (name === "login") return <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></svg>;
  if (name === "signup") return <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>;
}

function Navbar({ cartCount, wishCount, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-mark"><Icon name="logo" /></span>
        <span>WoodWise</span>
      </Link>

      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <Icon name="menu" />
      </button>

      <div className={menuOpen ? "nav-links show-menu" : "nav-links"}>
        <NavLink to="/products" onClick={() => setMenuOpen(false)}><Icon name="products" /> Products</NavLink>
        <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}><Icon name="heart" /> Wishlist <span className="nav-badge">{wishCount}</span></NavLink>
        <NavLink to="/cart" onClick={() => setMenuOpen(false)}><Icon name="cart" /> Cart <span className="nav-badge">{cartCount}</span></NavLink>
        {user ? (
          <>
            <Link to="/profile" className="user-pill" onClick={() => setMenuOpen(false)}>Hi, {user.name}</Link>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setMenuOpen(false)}><Icon name="login" /> Login</NavLink>
            <NavLink to="/signup" onClick={() => setMenuOpen(false)}><Icon name="signup" /> Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
