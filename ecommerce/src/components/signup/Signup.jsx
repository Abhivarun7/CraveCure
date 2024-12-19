import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.css"

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your axios post logic here
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-overlay">
        <div className="signup-box">
          <div className="logo-container">
            <img src="/logo-removebg-preview.png" alt="CraveCure Logo" className="logo" />
            <h1 className="brand-name">CraveCure</h1>
          </div>

          <h2 className="signup-title">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>
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
                placeholder="Create a password"
                className="form-input"
              />
            </div>
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>
          <p className="login-link">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="link">
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;