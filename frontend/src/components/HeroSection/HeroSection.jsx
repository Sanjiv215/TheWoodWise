import { Link } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="blue-text">Modern Furniture Store</p>
        <h1>The WoodWise</h1>
        <p>
          Bright, minimal and comfortable furniture for homes that feel calm and beautifully organized.
        </p>
        <Link to="/products" className="main-btn">Shop Collection</Link>
      </div>
      <div className="hero-showcase">
        <img src="../images/home.png" />
      </div>
    </section>
  );
}

export default HeroSection;
