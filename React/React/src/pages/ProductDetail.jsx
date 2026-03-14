import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProductDetails.css';

function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-state">Loading...</div>;
  if (error)   return <div className="detail-state detail-error">{error}</div>;
  if (!product) return null;

  return (
    <div className="detail-page">

      {/* Back button */}
      <button className="btn-back" onClick={() => navigate('/products')}>
        ← Back to products
      </button>

      <div className="detail-card">

        {/* Image*/}
        <div className="detail-img">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} />
            : <div className="detail-img-placeholder">📦</div>
          }
        </div>

        {/* Info */}
        <div className="detail-info">

          <span className="detail-category">
            {product.categoryName}
          </span>

          <h1 className="detail-name">{product.name}</h1>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-price">
            ${product.price?.toFixed(2)}
          </div>

          <div className={`detail-stock ${product.quantity === 0 ? 'out' : ''}`}>
            {product.quantity > 0
              ? `${product.quantity} items in stock`
              : 'Out of stock'
            }
          </div>

          <div className="detail-meta">
            <span>Category: <strong>{product.categoryName}</strong></span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;