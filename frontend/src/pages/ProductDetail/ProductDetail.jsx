import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { getProductById, getSimilarProducts } from "../../services/productService.js";
import "./ProductDetail.css";

function ProductDetail({ cartIds, wishlistIds, onAddCart, onToggleCart, onToggleWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const productData = await getProductById(id);
        if (cancelled) return;

        setProduct(productData);
        setMainImage(productData.image);
        setSimilarProducts(await getSimilarProducts(productData));
      } catch {
        if (!cancelled) {
          setProduct(null);
          setSimilarProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <main className="page"><div className="empty-box">Loading...</div></main>;
  }

  if (!product) {
    return <main className="page"><div className="empty-box">Product not found.</div></main>;
  }

  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80"
  ];
  // const similarProducts = getSimilarProducts(product, 4);

  return (
    <main className="page">
      <section className="detail-layout">
        <div className="detail-gallery">
          <img className="detail-img" src={mainImage} alt={product.title} />
          <div className="thumb-row">
            {galleryImages.map((image) => (
              <button className={mainImage === image ? "thumb active-thumb" : "thumb"} key={image} onClick={() => setMainImage(image)}>
                <img src={image} alt={product.title} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <p className="blue-text">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-meta">{product.brand} · {product.stock} in stock · Popularity {product.popularity}%</p>
          <p className="rating">★ {product.rating}</p>
          <h2>₹{product.price.toLocaleString("en-IN")}</h2>
          <p>{product.description}</p>

          <div className="quantity-box">
            <span>Quantity</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="big-buttons">
            <button onClick={() => onAddCart(product, quantity)}>Add {quantity} to Cart</button>
            <button className={cartIds.has(product.id) ? "outline-btn active-detail-btn" : "outline-btn"} onClick={() => onToggleCart(product)}>
              {cartIds.has(product.id) ? "Remove Quick Add" : "Quick Add"}
            </button>
            <button className={wishlistIds.has(product.id) ? "outline-btn active-wishlist-btn" : "outline-btn"} onClick={() => onToggleWishlist(product)}>
              {wishlistIds.has(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>
          <Link to="/products" className="back-link">Back to products</Link>
        </div>
      </section>

      <section className="similar-section">
        <div className="section-title">
          <p className="blue-text">Similar Picks</p>
          <h2>You may also like</h2>
        </div>
        <div className="product-grid">
          {similarProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isInCart={cartIds.has(item.id)}
              isWishlisted={wishlistIds.has(item.id)}
              onToggleCart={onToggleCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
