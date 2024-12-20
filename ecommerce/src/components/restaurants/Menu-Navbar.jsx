import React, { useState, useEffect } from 'react';
import { MapPin, User, LogOut, ShoppingBag, MessageSquare, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./menu-navbar.css"

const Navbar = ({ onSearch }) => {
  const [username, setUsername] = useState('Loading...');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUsername('Guest');
          return;
        }

        const response = await axios.get('https://cravecure.onrender.com/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.name) {
          setUsername(response.data.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setUsername('Guest');
      }
    };

    fetchUserData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const navigateToOrders = () => {
    setIsProfileDropdownOpen(false);
    const token = localStorage.getItem("token");
    navigate("/prevOrder", { state: { token } });
  };
  
  const navigateToFeedback = () => {
    setIsProfileDropdownOpen(false);
    navigate("/feedback");
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "https://cravecure.onrender.com/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      localStorage.removeItem("token");
      setUsername("Guest");
      setIsProfileDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.nav-username-display')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <div className="navbar">
      <ul className="nav-items">
        <div className="nav-search-display">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Em kaaavali bro...."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="nav-username-display">
          <div className="username-display" onClick={handleProfileClick}>
            <User size={20} className="user-icon" />
            <span>{username}</span>
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-item" onClick={navigateToOrders}>
                <ShoppingBag size={18} />
                Previous Orders
              </div>
              <div className="profile-item" onClick={navigateToFeedback}>
                <MessageSquare size={18} />
                Feedback
              </div>
              <div className="profile-item logout" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </div>
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;