import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./Wishlist.css";

function Wishlist({ wishlist, cartIds, wishlistIds, onToggleCart, onToggleWishlist }) {
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
              <ProductCard
                product={product}
                isInCart={cartIds.has(product.id)}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleCart={onToggleCart}
                onToggleWishlist={onToggleWishlist}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
