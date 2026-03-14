import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Products.css';

function Products() {
  const navigate = useNavigate();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  //Search & filter state 
  const [search,      setSearch]      = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [minPrice,    setMinPrice]    = useState('');
  const [maxPrice,    setMaxPrice]    = useState('');

  //Fetch categories for filter dropdown 
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Search & filter
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search)     params.append('name',       search);
      if (categoryId) params.append('categoryId', categoryId);
      if (minPrice)   params.append('minPrice',   minPrice);
      if (maxPrice)   params.append('maxPrice',   maxPrice);

      const res = await api.get(`/products/search?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  //Reset filters 
  const handleReset = () => {
    setSearch('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    fetchProducts();
  };

  return (
    <div className="products-page">

      {/* Page header */}
      <div className="products-header">
        <h2>Products</h2>
        <p>{products.length} items found</p>
      </div>

      {/* Search & filter bar  */}
      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="filter-input"
        />

        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="filter-select"
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="filter-price"
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="filter-price"
        />

        <button onClick={handleSearch} className="btn-search">
          Search
        </button>

        <button onClick={handleReset} className="btn-reset">
          Reset
        </button>

      </div>

      {/* States */}
      {loading && <div className="state-msg">Loading products...</div>}
      {error   && <div className="state-error">{error}</div>}

      {/*Empty state  */}
      {!loading && !error && products.length === 0 && (
        <div className="state-msg">No products found.</div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Image */}
              <div className="product-img">
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} />
                  : <div className="product-img-placeholder">📦</div>
                }
              </div>

              {/* Info */}
              <div className="product-info">
                <span className="product-category">
                  {product.categoryName}
                </span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="product-stock">
                    {product.quantity > 0
                      ? `${product.quantity} in stock`
                      : 'Out of stock'
                    }
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Products;