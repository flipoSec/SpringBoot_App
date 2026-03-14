import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminTable.css';

function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(null);

  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [formData,   setFormData]   = useState({
    name: '', description: '', price: '',
    quantity: '', imageUrl: '', categoryId: '',
  });

  useEffect(() => {
    fetchProducts();
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...formData,
        price:      parseFloat(formData.price),
        quantity:   parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId),
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setSuccess('Product updated');
      } else {
        await api.post('/products', payload);
        setSuccess('Product created');
      }
      setFormData({
        name: '', description: '', price: '',
        quantity: '', imageUrl: '', categoryId: '',
      });
      setShowForm(false);
      setEditId(null);
      fetchProducts();
    } catch {
      setError('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData({
      name:        product.name,
      description: product.description,
      price:       product.price,
      quantity:    product.quantity,
      imageUrl:    product.imageUrl || '',
      categoryId:  product.categoryId,
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted');
      fetchProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleNew = () => {
    setEditId(null);
    setFormData({
      name: '', description: '', price: '',
      quantity: '', imageUrl: '', categoryId: '',
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <h2>Products</h2>
          <p>{products.length} products total</p>
        </div>
        <button className="btn-add" onClick={handleNew}>
          + New product
        </button>
      </div>

      {error   && <div className="admin-msg error">{error}</div>}
      {success && <div className="admin-msg success">{success}</div>}

      {/* Form*/}
      {showForm && (
        <div className="admin-form-card">
          <h3>{editId ? 'Edit product' : 'New product'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="categoryId"
                  value={formData.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description"
                value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" name="price" step="0.01"
                  value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity"
                  value={formData.quantity} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" name="imageUrl"
                value={formData.imageUrl} onChange={handleChange}
                placeholder="https://..." />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-cancel"
                onClick={() => { setShowForm(false); setEditId(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table*/}
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.categoryName}</td>
                  <td>${p.price?.toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button className="btn-edit-sm"
                      onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-delete-sm"
                      onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;