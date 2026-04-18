import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Products(){
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [searchCat, setCategorySearchId] = useState("");

    const navigate = useNavigate();
    
    useEffect(()=> {
        api.get("/categories")
        .then((res) => setCategories(res.data))
        .catch(()=>{});
        fetchProducts();
    }, []);

    const fetchProducts = async(params = {}) =>{
        setLoading(true);
        setError(null);
        try{
            let response;

            if (params.name) {
                response = await api.get(`/products/search?name=${params.name}`);

            } else if (params.categoryId) {
                response = await api.get(`/products/category/${params.categoryId}`);

            } else {
                response = await api.get("/products");
            }
            setProducts(response.data);            
        }
        catch(err){
            setError("Failed to load products. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }

    const handleSearch = (e) =>{
        e.preventDefault();
        fetchProducts({name: search, categoryId});
    }

    
    const handleClear = () => {
        setSearch("");
        setCategoryId("");
        fetchProducts();
    }

    const handleViewDetail = (id) => {
        navigate(`/products/${id}`);
    }

    return(
        <div>
        <div>
            <h1>All Products</h1>
            <p>
            {loading
                ? "Loading…"
                : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
            </p>
        </div>

        <form onSubmit={handleSearch}>
            <input
            type="text"
            value={search}
            placeholder="Search products…"
            onChange={(e) => setSearch(e.target.value)}
            />

            <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            >
            <option value="">All categories</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.name}
                </option>
            ))}
            </select>

            <button type="submit">Search</button>
            <button type="button" onClick={handleClear}>Clear</button>
        </form>

        {error && <div>{error}</div>}

        {loading && (
            <div>
            {products.map((n) => (
                <div key={n}>Loading...</div>
            ))}
            </div>
        )}

        {!loading && !error && products.length === 0 && (
            <div>
            <p>No products found. Try adjusting your filters.</p>
            </div>
        )}

        {!loading && products.length > 0 && (
            <div>
            {products.map((prod) => (
                <div key={prod.id}>
                {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.name} />
                ) : (
                    <div>No image</div>
                )}
                <span>{prod.categoryName}</span>
                <div>{prod.name}</div>
                <div>{prod.description}</div>
                <div>
                    <span>{prod.price.toFixed(2)} MAD</span>
                    <span>
                    {prod.quantity === 0 ? "Out of stock" : `${prod.quantity} left`}
                    </span>
                </div>
                <button onClick={() => handleViewDetail(prod.id)}>
                    View details →
                </button>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}