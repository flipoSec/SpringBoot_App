import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Login.css';

function Register() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    confirm:   '',  
  });

  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validation — passwords match
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }

    // Frontend validation — password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Don't send 'confirm' to the backend
      const { confirm, ...requestData } = formData;
      const response = await api.post('/auth/register', requestData);
      login(response.data);  // auto login after register
      navigate('/products'); // new users always go to products
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        
        <div className="auth-header">
          <h2>Create account</h2>
          <p>Join us today</p>
        </div>

       
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>

      </div>
    </div>
  );
}

export default Register;