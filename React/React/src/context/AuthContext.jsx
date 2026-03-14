import { createContext, useContext, useState } from 'react';

// Create the context 
const AuthContext = createContext(null);

// Provider component 
export function AuthProvider({ children }) {

  // Initialize from localStorage so state survives page refresh
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Login 
  const login = (authResponse) => {
    // Save token
    localStorage.setItem('token', authResponse.token);
    // Save user info (without token)
    const userInfo = {
      firstName: authResponse.firstName,
      lastName:  authResponse.lastName,
      email:     authResponse.email,
      role:      authResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Update state
    setToken(authResponse.token);
    setUser(userInfo);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Helper flags 
  const isAuthenticated = !!token;
  const isAdmin         = user?.role === 'ADMIN';
  const isCustomer      = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isCustomer,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook 
// Instead of importing useContext + AuthContext everywhere,
// just import useAuth from any component
export function useAuth() {
  return useContext(AuthContext);
}