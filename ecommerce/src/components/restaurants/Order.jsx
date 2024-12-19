import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Menu-Navbar';
import RestaurantDetails from './RestaurantDetails';
import './order.css';

const Order = () => {
  const { id } = useParams(); // Extract the restaurantId from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/restaurants/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching restaurant details');
        }
        const data = await response.json();
        setRestaurant(data); // Store the restaurant data
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurantDetails();
  }, [id]); // Fetch details when the ID changes

  // Function to update search term
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="main-canvas">
        {restaurant ? (
          <RestaurantDetails searchTerm={searchTerm} />
        ) : (
          <p>Loading restaurant details...</p>
        )}
      </div>
    </div>
  );
};

export default Order;
