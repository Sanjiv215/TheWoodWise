import { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection/HeroSection.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService.js";
import "./Home.css";

function Home({ cartIds, wishlistIds, onToggleCart, onToggleWishlist }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const categories = ["Sofa", "Chair", "Table", "Bed", "Lamp", "Wardrobe", "Office Furniture"];
  const reviews = [
    { name: "Aarav", text: "The sofa looks premium and the website feels very smooth." },
    { name: "Meera", text: "Loved the dark blue design and simple shopping flow." },
    { name: "Kabir", text: "The office chair collection is clean and easy to compare." }
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const [featured, trending] = await Promise.all([
          getProducts({ sort: "newest", limit: 4 }),
          getProducts({ sort: "popular", limit: 4 }),
        ]);

        if (!cancelled) {
          setFeaturedProducts(featured);
          setTrendingProducts(trending);
        }
      } catch {
        if (!cancelled) {
          setFeaturedProducts([]);
          setTrendingProducts([]);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <HeroSection />

      <section className="section">
        <div className="section-title">
          <p className="blue-text">Handpicked</p>
          <h2>Featured Furniture</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInCart={cartIds.has(product.id)}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleCart={onToggleCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p className="blue-text">Browse</p>
          <h2>Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((item) => (
            <Link className="category-card" to="/products" key={item}>{item}</Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title collection-title">
          <p className="blue-text">Curated</p>
          <h2>Hand Picked Collection</h2>
          <span>Premium pieces selected for calm homes and sharp workspaces.</span>
        </div>
        <div className="product-grid handpicked-grid">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInCart={cartIds.has(product.id)}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleCart={onToggleCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p className="blue-text">Reviews</p>
          <h2>Happy Customers</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <div className="review-stars">★★★★★</div>
              <p>"{review.text}"</p>
              <h3>{review.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
