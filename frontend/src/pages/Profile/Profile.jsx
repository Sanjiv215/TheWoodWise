import { Link } from "react-router-dom";
import "./Profile.css";

function Profile({ user, cart, wishlist, orders, onLogout }) {
  if (!user) {
    return (
      <main className="page">
        <div className="empty-box">
          Please login to view your profile.
          <br />
          <Link className="main-btn" to="/login">Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="profile-top">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <button className="profile-logout" onClick={onLogout}>Logout</button>
      </div>

      <div className="profile-grid">
        <Link to="/orders" className="profile-box">
          <h3>Orders</h3>
          <p>{orders.length} placed</p>
        </Link>
        <Link to="/wishlist" className="profile-box">
          <h3>Wishlist</h3>
          <p>{wishlist.length} saved</p>
        </Link>
        <Link to="/cart" className="profile-box">
          <h3>Cart</h3>
          <p>{cart.length} item(s)</p>
        </Link>
        <div className="profile-box">
          <h3>Addresses</h3>
          <p>2 saved</p>
        </div>
      </div>

      <div className="zepto-list">
        <Link to="/orders">My Orders</Link>
        <Link to="/wishlist">Saved Products</Link>
        <Link to="/cart">Cart & Checkout</Link>
        <span>Address Book</span>
        <span>Account Settings</span>
        <span>Help & Support</span>
      </div>
    </main>
  );
}

export default Profile;
