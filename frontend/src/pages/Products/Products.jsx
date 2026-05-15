import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { filterProducts } from "../../services/productService.js";
import "./Products.css";

function Products({ cartIds, wishlistIds, onToggleCart, onToggleWishlist }) {
  const pageSize = 8;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [shownProducts, setShownProducts] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [search, category, maxPrice, rating, sort]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);

      try {
        const result = await filterProducts({ search, category, maxPrice, rating, sort, page, limit: pageSize });
        if (!cancelled) {
          setShownProducts(result.items || []);
          setTotalPages(result.pages || 1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [search, category, maxPrice, rating, sort, page]);

  function changeSearch(value) {
    setSearch(value);
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
          )}

          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  className={pageNumber === page ? "active-page" : ""}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Products;
