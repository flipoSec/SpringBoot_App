import { useState } from "react";
import {useAuth} from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            Shoppi<em>fy</em>
          </Link>

          <ul className="nav-links">
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/products" className={isActive('/products')}>Products</Link></li>
            {isAdmin && (
              <li><Link to="/admin" className={isActive('/admin')}>Dashboard</Link></li>
            )}
          </ul>

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                {isAdmin && <span className="nav-badge-admin">Admin</span>}
                <span className="nav-user-name">Hi, {user?.firstName}</span>
                {!isAdmin && (
                  <Link to="/profile" className="nav-btn-ghost">Profile</Link>
                )}
                <div className="nav-divider" />
                <button className="nav-btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn-ghost">Login</Link>
                <Link to="/register" className="nav-btn-primary">Register</Link>
              </>
            )}
          </div>

          <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </>
  );
}
