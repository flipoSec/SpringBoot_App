import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts:   0,
    totalCategories: 0,
    totalUsers:      0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all three in parallel
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
      api.get('/users'),
    ])
      .then(([products, categories, users]) => {
        setStats({
          totalProducts:   products.data.length,
          totalCategories: categories.data.length,
          totalUsers:      users.data.length,
        });
      })
      .catch(err => console.error('Failed to load stats', err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title:  'Total Products',
      value:  stats.totalProducts,
      icon:   '📦',
      link:   '/admin/products',
      color:  '#e94560',
    },
    {
      title:  'Total Categories',
      value:  stats.totalCategories,
      icon:   '🗂️',
      link:   '/admin/categories',
      color:  '#3498db',
    },
    {
      title:  'Total Users',
      value:  stats.totalUsers,
      icon:   '👥',
      link:   '/admin/users',
      color:  '#27ae60',
    },
  ];

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading stats...</div>
      ) : (
        <div className="stats-grid">
          {cards.map(card => (
            <Link to={card.link} key={card.title} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: card.color }}>
                {card.icon}
              </div>
              <div className="stat-info">
                <span className="stat-value">{card.value}</span>
                <span className="stat-title">{card.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/*  Quick links */}
      <div className="quick-links">
        <h3>Quick actions</h3>
        <div className="quick-grid">
          <Link to="/admin/products"   className="quick-btn">➕ Add product</Link>
          <Link to="/admin/categories" className="quick-btn">➕ Add category</Link>
          <Link to="/admin/users"      className="quick-btn">👥 View users</Link>
          <Link to="/products"         className="quick-btn">🛍️ View store</Link>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;