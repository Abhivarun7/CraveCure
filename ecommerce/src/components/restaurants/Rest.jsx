import React, { useState, useEffect } from "react";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./Restaurants.css";

const Restaurants = ({ location }) => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/restaurants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const filteredRestaurants = location
          ? data.filter((restaurant) => restaurant.Location === location)
          : data;
        setRestaurants(filteredRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
      }
    };

    fetchRestaurants();
  }, [location]);

  const handleCardClick = (restaurantId) => {
    console.log("Restaurant ID:", restaurantId);  // Ensure the ID is correct
    navigate(`/order/${restaurantId}`); // Navigate to the Order page with restaurant ID
};

  
  

  return (
    <div className="restaurants-container">
      {restaurants.length === 0 ? (
        <div className="no-restaurants">
          <h3>We will be there soon!</h3>
          <p>Stay tuned for amazing restaurants in your area.</p>
        </div>
      ) : (
        restaurants.map((restaurant, index) => (
          <div
            className="restaurant-card"
            key={index}
            onClick={() => handleCardClick(restaurant._id)} // Pass the restaurant ID
          >
            <div className="restaurant-image">
              <img src={restaurant.Restaurant_Image} alt={restaurant.Restaurant_Name} />
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.Restaurant_Name}</h3>
              <div className="details">
                <div className="detail-item">
                  <Star className="icon" size={16} />
                  <span>{restaurant.Rating}</span>
                </div>
                <div className="detail-item">
                  <MapPin className="icon" size={16} />
                  <span>{restaurant.Location}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Restaurants;
