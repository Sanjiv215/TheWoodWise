import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, isInCart, isWishlisted, onToggleCart, onToggleWishlist }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <p className="category-text">{product.category}</p>
      <h3>{product.title}</h3>
      <p className="product-brand">{product.brand}</p>
      <p className="rating">★ {product.rating} · {product.stock} in stock</p>
      <h2>₹{product.price.toLocaleString("en-IN")}</h2>
      <div className="product-card-buttons">
        <button className={isInCart ? "cart-toggle active-cart" : "cart-toggle"} onClick={() => onToggleCart(product)}>
          {isInCart ? "Remove" : "Quick Add"}
        </button>
        <button
          className={isWishlisted ? "outline-btn heart-btn active-heart" : "outline-btn heart-btn"}
          onClick={() => onToggleWishlist(product)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          ♥
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
