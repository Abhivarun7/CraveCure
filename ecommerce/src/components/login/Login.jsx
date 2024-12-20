import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cravecure.onrender.com/api/auth/login',{
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/Index');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-box">
          <div className="logo-container">
            <img src="/logo-removebg-preview.png" alt="CraveCure Logo" className="logo" />
            <h1 className="brand-name">CraveCure</h1>
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="signup-link">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} className="link">
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;