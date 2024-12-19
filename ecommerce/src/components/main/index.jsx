import React, { useState } from "react";
import Navbar from "../assests/Navbar";
import Popularfood from "../popularfood/Popularfood.jsx";
import Foods from "../assests/Foods.jsx";

const Index = () => {
  const [location, setLocation] = useState(""); // Shared location state
  const [isSearchActive, setIsSearchActive] = useState(false); // Track search box activity
  const [searchResults, setSearchResults] = useState({ restaurants: [] });


  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSearchResults = (results) => {
    console.log(results);
    setSearchResults(results);
  };
  
  const handleSearchToggle = (isActive) => {
    setIsSearchActive(isActive); // Update search activity state
  };
  
  return (
    <div>
      <Navbar
        onLocationChange={handleLocationChange}
        currentLocation={location}
        onSearchToggle={handleSearchToggle}
        onSearch={handleSearchResults} // Update this function to handle search results
      />
  
      <div className="main-canvas">
        {!isSearchActive && <Popularfood location={location} />}
        {isSearchActive && <Foods searchResults={searchResults} location={location} />}
      </div>
    </div>
  );
};  

export default Index;
