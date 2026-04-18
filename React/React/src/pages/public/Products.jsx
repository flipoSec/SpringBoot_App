import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
    fetchProducts();
  }, []);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
        let response;

        if (params.name && params.categoryId) {
            response = await api.get(`/products/search?name=${encodeURIComponent(params.name)}`);
        } else if (params.name) {
            response = await api.get(`/products/search?name=${encodeURIComponent(params.name)}`);
        } else if (params.categoryId) {
            response = await api.get(`/products/category/${params.categoryId}`);
        } else {
            response = await api.get("/products");
        }

        setProducts(response.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ name: search.trim(), categoryId });
  };

  const handleClear = () => {
    setSearch("");
    setCategoryId("");
    fetchProducts();
  };

  const handleViewDetail = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <div>
          <h1>All Products</h1>
          <p className="products-summary">
            {loading
              ? "Loading product catalog..."
              : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <section className="products-panel">
        <form className="products-search" onSubmit={handleSearch}>
          <label>
            Search
            <input
              type="text"
              value={search}
              placeholder="Search products…"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </label>

          <label>
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="products-actions">
            <button className="button button-primary" type="submit">
              Search
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {error && <div className="products-error">{error}</div>}

      {loading && (
        <div className="loading-state">Loading products, please wait…</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="products-empty">
          <p>No products found.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((prod) => (
            <article className="product-card" key={prod.id}>
              <div className="product-card-image">
                {prod.imageUrl ? (
                  <img src={prod.imageUrl} alt={prod.name} />
                ) : (
                  <div className="loading-state">No image available</div>
                )}
              </div>

              <div className="product-card-body">
                <div className="product-meta">
                  <span>{prod.categoryName || "General"}</span>
                  <span className={`product-stock ${prod.quantity === 0 ? "out" : ""}`}>
                    {prod.quantity === 0 ? "Out of stock" : `${prod.quantity} left`}
                  </span>
                </div>

                <h2 className="product-name">{prod.name}</h2>
                <p className="product-description">
                  {prod.description || "No product description available."}
                </p>

                <div className="product-details">
                  <span className="product-price">
                    {typeof prod.price === "number"
                      ? `${prod.price.toFixed(2)} MAD`
                      : "Price unavailable"}
                  </span>
                </div>

                <div className="product-card-footer">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => handleViewDetail(prod.id)}
                  >
                    View details →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
