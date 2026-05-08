import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./Wishlist.css";

function Wishlist({ wishlist, onAddCart, onAddWishlist, onRemoveWishlist }) {
  return (
    <main className="page">
      <div className="page-title">
        <p className="blue-text">Saved</p>
        <h1>Your Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty empty-box">
          <h2>Your wishlist is empty</h2>
          <p>Save your favourite furniture and view it here later.</p>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <div className="wishlist-card-wrap" key={product.id}>
              <ProductCard product={product} onAddCart={onAddCart} onAddWishlist={onAddWishlist} />
              <button className="remove-btn" onClick={() => onRemoveWishlist(product.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
