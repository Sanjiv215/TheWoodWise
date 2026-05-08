import { useState } from "react";
import products from "../../data/products.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import "./Products.css";

function Products({ onAddCart, onAddWishlist }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  let shownProducts = products.filter((product) => {
    const searchMatch = product.title.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = category === "All" || product.category === category;
    const priceMatch = product.price <= Number(maxPrice);
    const ratingMatch = product.rating >= Number(rating);
    return searchMatch && categoryMatch && priceMatch && ratingMatch;
  });

  if (sort === "low") shownProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") shownProducts.sort((a, b) => b.price - a.price);
  if (sort === "rating") shownProducts.sort((a, b) => b.rating - a.rating);
  if (sort === "newest") shownProducts.sort((a, b) => new Date(b.date) - new Date(a.date));

  function changeSearch(value) {
    setLoading(true);
    setSearch(value);
    setTimeout(() => setLoading(false), 300);
  }

  return (
    <main className="page">
      <div className="page-title">
        <p className="blue-text">Shop</p>
        <h1>All Furniture</h1>
      </div>

      <SearchBar search={search} setSearch={changeSearch} />
      <button className="mobile-filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
        {filterOpen ? "Close Filters" : "Open Filters"}
      </button>

      <div className="shop-layout">
        <div className={filterOpen ? "filter-drawer show-filter" : "filter-drawer"}>
          <FilterSidebar
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            rating={rating}
            setRating={setRating}
            sort={sort}
            setSort={setSort}
          />
        </div>

        <div className="shop-products">
          {loading ? (
            <Loader />
          ) : shownProducts.length === 0 ? (
            <div className="empty-box">No products found.</div>
          ) : (
            <div className="product-grid">
              {shownProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddCart={onAddCart} onAddWishlist={onAddWishlist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Products;
