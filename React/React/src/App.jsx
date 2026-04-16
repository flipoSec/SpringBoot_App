import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
  <>
  </>
  );
}

export default App;