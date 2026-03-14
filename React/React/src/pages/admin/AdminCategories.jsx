import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminTable.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(null);

  // Form state 
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [formData,   setFormData]   = useState({
    name: '', description: ''
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      setError('Failed to load categories');
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
      if (editId) {
        await api.put(`/categories/${editId}`, formData);
        setSuccess('Category updated');
      } else {
        await api.post('/categories', formData);
        setSuccess('Category created');
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditId(null);
      fetchCategories();
    } catch {
      setError('Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setFormData({ name: cat.name, description: cat.description });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setSuccess('Category deleted');
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  const handleNew = () => {
    setEditId(null);
    setFormData({ name: '', description: '' });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <h2>Categories</h2>
          <p>{categories.length} categories total</p>
        </div>
        <button className="btn-add" onClick={handleNew}>
          + New category
        </button>
      </div>

      {error   && <div className="admin-msg error">{error}</div>}
      {success && <div className="admin-msg success">{success}</div>}

      {/* Form  */}
      {showForm && (
        <div className="admin-form-card">
          <h3>{editId ? 'Edit category' : 'New category'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => { setShowForm(false); setEditId(null); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.description || '—'}</td>
                  <td>{cat.productCount}</td>
                  <td>
                    <button
                      className="btn-edit-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete-sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
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

export default AdminCategories;