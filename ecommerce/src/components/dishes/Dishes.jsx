import React, { useState } from 'react';
import axios from 'axios';

function Dishes() {
  const [dish, setDish] = useState(null); // Single dish response
  const [error, setError] = useState('');

  const fetchDishes = async (category) => {
    console.log(`Button clicked for category: ${category}`);
    try {
      console.log('Sending GET request to server...');
      const response = await fetch(`https://cravecure.onrender.com/fetch-dishes/${category}`);
      console.log('Response received from server:', response.data);

      setDish(response.data); // Set dish data (name, image, rating)
      console.log('Dish state updated:', response.data);

      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error while fetching dishes:', err.message);
      setDish(null);
      setError(`Failed to fetch ${category} dishes. Please try again.`);
    }
  };

  console.log('Current dish state:', dish);
  console.log('Current error state:', error);

  return (
    <div>
      <button onClick={() => fetchDishes('biryani')}>Biryani</button>
      <button onClick={() => fetchDishes('starters')}>Starters</button>

      <div>
        <h2>Dish Details</h2>
        {dish ? (
          <div>
            <h3>{dish.name}</h3>
            <img
              src={dish.image}
              alt={dish.name}
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            />
            <p>Rating: {dish.rating}</p>
          </div>
        ) : (
          <p>{error || 'No dish selected.'}</p>
        )}
      </div>
    </div>
  );
}

export default Dishes;
