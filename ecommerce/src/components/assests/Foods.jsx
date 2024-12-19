import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react"; // Assuming you're using 'lucide-react' for icons
import "./foods.css";

const Foods = ({ searchResults, location }) => {
  // Ensure searchResults is always an array
  const restaurants = Array.isArray(searchResults) ? searchResults : [];

  // Log the entire restaurant data to confirm its structure
  console.log("Restaurants Data:", restaurants);

  const navigate = useNavigate();

  const handleCardClick = (restaurantId) => {
    console.log("Restaurant ID:", restaurantId);
    navigate(`/order/${restaurantId}`);
  };

  return (
    <div className="foods-container">
      <div className="column">
        <h2>Restaurants</h2>
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
                  {/* Check if the image path is correct and accessible */}
                  <img
                    src={restaurant.Restaurant_Image}
                    alt={restaurant.Restaurant_Name}
                  />
                </div>
                <div className="restaurant-info">
                  {/* Access the correct property for restaurant name */}
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
      </div>
    </div>
  );
};

export default Foods;
