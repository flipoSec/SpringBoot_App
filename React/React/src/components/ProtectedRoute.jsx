import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Props
// children    → the page component to render if allowed
// requireAuth → true = must be logged in
// requireAdmin → true = must be ADMIN role
function ProtectedRoute({ children, requireAuth, requireAdmin }) {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in → redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // All checks passed → render the page
  return children;
}

export default ProtectedRoute;