import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        api.get(`/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]); 

    const handleBack = () => {
        navigate('/products'); 
    };

    const handleAddCart = () => {
        console.log("Adding to cart:", product.id);
        
    };

    if (loading) return <div className="loading-state">Loading product details...</div>;
    if (!product) return <div className="error-message">Product not found.</div>;

    return (
        <div className="product-detail-container">
            <nav className="breadcrumb">
                <Link to='/products'>Products</Link>
                {' > '}
                <span>{product.name}</span>
            </nav>

            <div className="product-detail-view">
                <article className="product-main">
                    <div className="product-image-large">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                        ) : (
                            <div className="no-image-placeholder">No image available</div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <div className="product-header">
                            <span className="category-badge">{product.categoryName || "General"}</span>
                            <h1 className="product-title">{product.name}</h1>
                            <p className={`stock-status ${product.quantity === 0 ? "out" : ""}`}>
                                {product.quantity === 0 ? "Out of stock" : `${product.quantity} units left`}
                            </p>
                        </div>

                        <p className="product-detail-description">
                            {product.description || "No product description available."}
                        </p>

                        <div className="product-price-box">
                            <span className="price-tag">
                                {typeof product.price === "number"
                                    ? `${product.price.toFixed(2)} MAD`
                                    : "Price unavailable"}
                            </span>
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="button button-secondary" 
                                onClick={handleBack}
                            >
                                ← Back
                            </button>
                            
                            <button 
                                className="button button-primary"
                                onClick={handleAddCart}
                                disabled={product.quantity === 0}
                            >
                                {product.quantity === 0 ? "Unavailable" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}