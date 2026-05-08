import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, onAddCart, onAddWishlist }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <p className="category-text">{product.category}</p>
      <h3>{product.title}</h3>
      <p className="rating">★ {product.rating}</p>
      <h2>₹{product.price.toLocaleString("en-IN")}</h2>
      <div className="product-card-buttons">
        <button onClick={() => onAddCart(product)}>Quick Add</button>
        <button className="outline-btn heart-btn" onClick={() => onAddWishlist(product)}>♡</button>
      </div>
    </div>
  );
}

export default ProductCard;
