import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import products from "../../data/products.js";
import "./ProductDetail.css";

function ProductDetail({ onAddCart, onAddWishlist }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const [mainImage, setMainImage] = useState(product ? product.image : "");
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState("");
  const [deliveryText, setDeliveryText] = useState("");

  if (!product) {
    return <main className="page"><div className="empty-box">Product not found.</div></main>;
  }

  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80"
  ];

  function addManyToCart() {
    for (let i = 0; i < quantity; i++) {
      onAddCart(product);
    }
  }

  function checkDelivery() {
    if (pinCode.length < 5) {
      setDeliveryText("Please enter a valid pin code.");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + 4);
    const text = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
    setDeliveryText(`Delivery by ${text}`);
  }

  return (
    <main className="page detail-layout">
      <div className="detail-gallery">
        <img className="detail-img" src={mainImage} alt={product.title} />
        <div className="thumb-row">
          {galleryImages.map((image) => (
            <button className={mainImage === image ? "thumb active-thumb" : "thumb"} key={image} onClick={() => setMainImage(image)}>
              <img src={image} alt={product.title} />
            </button>
          ))}
        </div>
      </div>
      <div className="detail-info">
        <p className="blue-text">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="rating">★ {product.rating}</p>
        <h2>₹{product.price.toLocaleString("en-IN")}</h2>
        <p>{product.description}</p>
        <div className="quantity-box">
          <span>Quantity</span>
          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
          <strong>{quantity}</strong>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <div className="delivery-box">
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter pin code" />
          <button onClick={checkDelivery}>Check</button>
        </div>
        {deliveryText && <p className="delivery-text">{deliveryText}</p>}
        <div className="big-buttons">
          <button onClick={addManyToCart}>Add to Cart</button>
          <button className="outline-btn" onClick={() => onAddWishlist(product)}>Add to Wishlist</button>
        </div>
        <Link to="/products" className="back-link">Back to products</Link>
      </div>
    </main>
  );
}

export default ProductDetail;
