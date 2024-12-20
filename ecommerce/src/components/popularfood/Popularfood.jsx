import React, { useEffect, useState } from "react";
import "./Popularfood.css";
import { useNavigate } from "react-router-dom";
import Restaurants from "../restaurants/Rest";

const Popularfood = ({ location }) => {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://cravecure.onrender.com/api/food");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCardClick = () => {
    navigate(`/dish/`);
  };

  return (
    <div className="popular-food">
      <div className="categories">
        {categories.map((category, index) => (
          <div key={index} className="category">
            <h3 className="category-title">{category.name}</h3>
            <div className="food-items">
              {category.items.map((item, idx) => (
                <div key={idx} className="food-card"  onClick={() => handleCardClick()}>
                  <img src={item.image} alt={item.name} className="food-image" />
                  <p className="food-name">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h2 className="section-title">Restaurants nearby you</h2>
      <div className="restaurants-nearby">
        <Restaurants location={location} /> {/* Pass location to Restaurants */}
      </div>
    </div>
  );
};

export default Popularfood;
