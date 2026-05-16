import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount, getCartTotal } from "../../utils/cart";
import "./Profile.css";

function Profile({ user, cart, wishlist, orders, onLogout, onDeleteAccount, onUpdateName }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

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

  async function handleNameSubmit(e) {
    e.preventDefault();

    const nextName = name.trim();
    if (!nextName) {
      setNameError("Name is required.");
      return;
    }

    if (nextName.length > 60) {
      setNameError("Name must be 60 characters or less.");
      return;
    }

    setNameError("");
    setSavingName(true);
    const updated = await onUpdateName(nextName);
    setSavingName(false);

    if (updated) setIsEditingName(false);
  }

  function cancelNameEdit() {
    setName(user.name);
    setNameError("");
    setIsEditingName(false);
  }

  const latestOrder = orders[0];
  const cartCount = getCartCount(cart);
  const cartTotal = getCartTotal(cart);
  const recentActivity = [
    `${cartCount} item${cartCount === 1 ? "" : "s"} in cart`,
    `${wishlist.length} saved product${wishlist.length === 1 ? "" : "s"}`,
    latestOrder ? `Last order: ${latestOrder.product}` : "No orders yet"
  ];

  return (
    <main className="page profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <p className="blue-text">My WoodWise</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="profile-actions">
          <button className="profile-logout" onClick={onLogout}>Logout</button>
          <button className="profile-delete" onClick={onDeleteAccount}>Delete Account</button>
        </div>
      </section>

      <section className="profile-metrics">
        <Link to="/orders" className="profile-card">
          <span>Orders</span>
          <strong>{orders.length}</strong>
          <p>{latestOrder ? "Latest order ready to review" : "Start your first order"}</p>
        </Link>
        <Link to="/wishlist" className="profile-card">
          <span>Wishlist</span>
          <strong>{wishlist.length}</strong>
          <p>Saved pieces across the catalog</p>
        </Link>
        <Link to="/cart" className="profile-card">
          <span>Cart</span>
          <strong>{cartCount}</strong>
          <p>₹{cartTotal.toLocaleString("en-IN")} current total</p>
        </Link>
      </section>

      <section className="profile-content">
        <div className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="blue-text">Orders</p>
              <h2>Order Summary</h2>
            </div>
            <Link to="/orders">View all</Link>
          </div>
          {latestOrder ? (
            <div className="order-preview">
              <strong>{latestOrder.product}</strong>
              <span>{latestOrder.date} · {latestOrder.time}</span>
              <p>{latestOrder.paymentMode} · ₹{latestOrder.price.toLocaleString("en-IN")}</p>
            </div>
          ) : (
            <div className="empty-inline">No orders yet. Explore the catalog and build your first room.</div>
          )}
        </div>

        <div className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="blue-text">Activity</p>
              <h2>Recent Activity</h2>
            </div>
          </div>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="blue-text">Info</p>
              <h2>Personal Info</h2>
            </div>
            {!isEditingName && (
              <button className="profile-edit-btn" type="button" onClick={() => setIsEditingName(true)}>
                Edit name
              </button>
            )}
          </div>
          {isEditingName ? (
            <form className="profile-name-form" onSubmit={handleNameSubmit}>
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                value={name}
                maxLength="60"
                onChange={(e) => setName(e.target.value)}
                disabled={savingName}
              />
              {nameError && <p className="profile-form-error">{nameError}</p>}
              <div className="profile-form-actions">
                <button type="submit" disabled={savingName}>
                  {savingName ? "Saving..." : "Save name"}
                </button>
                <button className="profile-cancel-btn" type="button" onClick={cancelNameEdit} disabled={savingName}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-list">
              <span>Name <strong>{user.name}</strong></span>
              <span>Email <strong>{user.email}</strong></span>
            </div>
          )}
        </div>

        <div className="profile-panel danger-panel">
          <div className="panel-heading">
            <div>
              <p className="blue-text">Account</p>
              <h2>Delete Account</h2>
            </div>
          </div>
          <p>This permanently removes your account, sessions and saved order data.</p>
          <button className="profile-delete" onClick={onDeleteAccount}>Delete my account</button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
