import { useState, useEffect, useEffectEvent } from "react";
import {Link, NavLink, useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ProductDetail(){
    const [product, setProducts] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        Navigate(-1)
    }
    const handleAddCart = ( ) => {

    }
    useEffect(()=>{
        api.get(`products/${id}`)
        .then((res) => setProducts(res.data))
        .catch(() => {});
    }, [])

    return(<div>
        <div>
            <Link to='/products'>Products</Link>
            {'  >  '}
            {product?.name}
        </div>

        <div className="products-grid">
            {product.map((prod) => (
                <article  className="product-card" key={prod.id}>
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
                                onClick={() => handleBack(prod.id)}
                            >
                                {'<- Back to Products'}

                            </button>
                            
                            <button disabled={product.quantity === 0}>
                            {product.quantity === 0 ? "Out of stock" : "Add to cart"}
                            </button>
                        </div>
                    </div>
                </article>    
            ))
            }
        </div>
        
    </div>);
}