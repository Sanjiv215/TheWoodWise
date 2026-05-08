import "./FilterSidebar.css";

function FilterSidebar({ category, setCategory, maxPrice, setMaxPrice, rating, setRating, sort, setSort }) {
  const categories = ["All", "Sofa", "Chair", "Table", "Bed", "Lamp", "Wardrobe", "Office Furniture"];

  return (
    <aside className="filter-box">
      <div className="filter-title">
        <h3>Filters</h3>
        <span>Refine collection</span>
      </div>

      <label>Category</label>
      <div className="category-checks">
        {categories.map((item) => (
          <button
            className={category === item ? "filter-chip active-chip" : "filter-chip"}
            key={item}
            onClick={() => setCategory(item)}
          >
            <span>{category === item ? "✓" : ""}</span>
            {item}
          </button>
        ))}
      </div>

      <label>Max Price: ₹{maxPrice}</label>
      <input type="range" min="5000" max="60000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

      <label>Minimum Rating</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="0">Any Rating</option>
        <option value="4">4 Stars</option>
        <option value="4.5">4.5 Stars</option>
      </select>

      <label>Sort By</label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="rating">Rating high to low</option>
        <option value="low">Price low to high</option>
        <option value="high">Price high to low</option>
        <option value="newest">New arrivals</option>
      </select>
    </aside>
  );
}

export default FilterSidebar;
