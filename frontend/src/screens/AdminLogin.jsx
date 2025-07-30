import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderRow from '../components/HeaderRow';
import { login } from '../services/api';
import { AuthContext } from '../navigation/AdminNavigator';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // Context should now be available
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('AdminLogin: Attempting login with', { email });
      const response = await login({ email, password });
      if (response.success) {
        console.log('AdminLogin: Login successful, navigating to AdminDashboard');
        setIsAuthenticated(true);
        navigate('/admin-dashboard');
      } else {
        setError(response.message || 'Invalid email or password');
        console.log('AdminLogin: Login failed:', response.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('AdminLogin error:', err);
    }
  };

  return (
    <motion.div
      className="admin-login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderRow />
      <div className="form-container">
        <h2 className="title">Admin Login</h2>
        {error && <span className="error-text">{error}</span>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button
          onClick={() => navigate('/admin-signup')}
          className="link-button"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </motion.div>
  );
}