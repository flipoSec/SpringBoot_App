import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages 
import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetail  from './pages/ProductDetail';
import Login          from './pages/Login';
import Register       from './pages/Register';

// Customer pages
import Profile        from './pages/Profile';

// Admin pages
import Dashboard        from './pages/admin/Dashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminCategories  from './pages/admin/AdminCategories';
import AdminUsers       from './pages/admin/AdminUsers';

// Layout
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Public routes */}
        <Route path="/"            element={<Home />} />
        <Route path="/products"    element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/*Auth routes */}
        {/* If already logged in → redirect away from login/register */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Register />
          }
        />

        {/* Customer routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/*  404 → redirect home  */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;