import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, isAdmin, isCustomer, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">


      <div className="navbar-logo">
        <Link to="/">App</Link>
      </div>

  
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {isAdmin && (
          <>
            <Link to="/admin/dashboard"  className="admin-link">Dashboard</Link>
            <Link to="/admin/products"   className="admin-link">Manage Products</Link>
            <Link to="/admin/categories" className="admin-link">Manage Categories</Link>
            <Link to="/admin/users"      className="admin-link">Manage Users</Link>
          </>
        )}
      </div>



      <div className="navbar-auth">

        {!isAuthenticated && (
          <>
            <Link to="/login"    className="btn-outline">Login</Link>
            <Link to="/register" className="btn-fill">Register</Link>
          </>
        )}

        {isAuthenticated && (
          <div className="navbar-user">
            {isCustomer && (
              <Link to="/profile">👤 {user?.firstName}</Link>
            )}
            {isAdmin && (
              <span className="admin-badge">🔑 {user?.firstName}</span>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;