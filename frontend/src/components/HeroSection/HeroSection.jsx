import { Link } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>The WoodWise</h1>
        <p>
          Discover the best wooden furniture for your home.
        </p>
        <Link to="/products" className="main-btn">Shop Collection</Link>
      </div>

    </section>
  );
}

export default HeroSection;
