import React, { useState, useEffect } from "react";
import "./navbar.css";
import axios from "axios";
import { MapPin, User, LogOut, ShoppingBag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLocationChange, currentLocation, onSearchToggle, onSearch }) => {
  const [location, setLocation] = useState(currentLocation || "");
  const [username, setUsername] = useState("Loading...");
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUsername("Welcome Guest");
          return;
        }

        const response = await axios.get("http://localhost:3001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUsername(response.data.name || "Guest");
          const userLocation = response.data.location || "Select Location";
          setLocation(userLocation);

          if (!currentLocation) {
            onLocationChange(userLocation);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        setUsername("Guest");
      }
    };

    fetchUserData();
  }, [onLocationChange, currentLocation]);

  const handleLocationSelect = async (selectedLocation) => {
    setLocation(selectedLocation);
    onLocationChange(selectedLocation);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, unable to update location.");
        return;
      }

      await axios.post(
        "http://localhost:3001/api/auth/update-location",
        { location: selectedLocation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Location updated successfully.");
    } catch (error) {
      console.error("Error updating location:", error.response?.data || error);
    }
  };

  const handleSearch = async (query) => {
    console.log("Search Query:", query);
    console.log("Location:", location);
  
    setSearchQuery(query);
    const isActive = query.length > 0;
  
    onSearchToggle(isActive); // Notify parent about search activity
    if (!isActive) {
      onSearch([]); // Clear search results when query is empty
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:3001/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
      );
      console.log("Search Results:", response.data); // Log results
  
      // Filter to get only the restaurant data, without dishes
      const restaurants = response.data.map((restaurant) => ({
        _id: restaurant._id,
        Location: restaurant.Location,
        Restaurant_Name: restaurant.Restaurant_Name,
        Restaurant_Image: restaurant.Restaurant_Image,
        Rating: restaurant.Rating,
        // You can add other restaurant details as needed, excluding 'dishes'
      }));
      
      onSearch(restaurants || []); // Pass only restaurants to the parent
    } catch (error) {
      console.error("Error fetching search results:", error.response?.data || error);
      onSearch([]); // Pass empty results on error
    }
  };
  

    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post(
            "http://localhost:3001/api/auth/logout",
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
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
  
    const navigateToOrders = () => {
      setIsProfileDropdownOpen(false);
      const token = localStorage.getItem("token");  // Get the token
      navigate("/prevOrder", { state: { token } }); // Pass token as state to the prevOrder page
    };
    
    const navigateToFeedback = () => {
      setIsProfileDropdownOpen(false);
      navigate("/feedback"); // Navigate to feedback page
    };
  
    const handleProfileClick = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
      // Close location dropdown if open
      if (isLocationSelectorOpen) {
        setIsLocationSelectorOpen(false);
      }
    };
  
    // Click outside to close dropdowns
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest('.nav-username-display') && !event.target.closest('.nav-location-display')) {
          setIsProfileDropdownOpen(false);
          setIsLocationSelectorOpen(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="navbar">
        <ul className="nav-items">
          <div className="nav-search-display">
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-display"
            />
          </div>
          
          <div className="nav-location-display">
            <div 
              className="location-display"
              onClick={() => setIsLocationSelectorOpen(!isLocationSelectorOpen)}
            >
              {location}
              <MapPin size={16} />
            </div>
            {isLocationSelectorOpen && (
              <div className="location-dropdown">
                {["A", "B", "C", "D"].map((loc) => (
                  <div
                    key={loc}
                    className="location-item"
                    onClick={() => handleLocationSelect(loc)}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className="nav-username-display">
            <div className="username-display" onClick={handleProfileClick}>
              <User size={16} className="user-icon" />
              {username}
            </div>
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-item" onClick={navigateToOrders}>
                  <ShoppingBag size={16} />
                  Previous Orders
                </div>
                <div className="profile-item" onClick={navigateToFeedback}>
                  <MessageSquare size={16} />
                  Feedback
                </div>
                <div className="profile-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
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