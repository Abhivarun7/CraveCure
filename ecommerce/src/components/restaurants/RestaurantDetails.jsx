import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useParams } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, ShoppingBag } from "lucide-react";
import "./RestaurantDetails.css";
import axios from "axios";

const RestaurantDetails = ({ searchTerm = "" }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [selection, setSelection] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
      setSelection(newSelection);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Please Login");
          return;
        }

        await axios.get("https://cravecure.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
      }
    };

    fetchUserData();
  }, []);

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, unable to place the order.");
        return;
      }

      await axios.post(
        "https://cravecure.onrender.com/api/auth/add-order",
        { order: cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order Placed successfully.");
      setCart([]);
    } catch (error) {
      console.error("Error Placing the Order:", error.response?.data || error);
    }
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(
          `https://cravecure.onrender.com/api/restaurants/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const restaurant = await response.json();
        setRestaurant(restaurant);
      } catch (error) {
        console.error("Error fetching restaurant details:", error.message);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const normalizedSearchTerm = searchTerm
    ? String(searchTerm).toLowerCase()
    : "";

  const filterDishes = (category) => {
    return category.filter((item) => {
      const matchesSearch = normalizedSearchTerm
        ? item.name.toLowerCase().includes(normalizedSearchTerm)
        : true;

      const matchesSelection = selection ? item.type === selection : true;

      return matchesSearch && matchesSelection;
    });
  };

  const hasAnyDishes = () => {
    if (!restaurant) return false;
    return Object.keys(restaurant.Dishes).some(
      (category) => filterDishes(restaurant.Dishes[category]).length > 0
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = (item) => {
    const newItem = {
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantName: restaurant.Restaurant_Name,
    };

    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name
    );
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (itemName) => {
    const updatedCart = cart
      .map((item) => {
        if (item.name === itemName) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    setCart(updatedCart);
  };

  return (
    <div className="restaurant-container">
      <div
        className={`content-wrapper ${isModalOpen ? "content-blur" : ""}`}
        aria-hidden={isModalOpen}
      >
        {restaurant ? (
          <>
            <div className="restaurant-header">
              <h1>{restaurant.Restaurant_Name}</h1>
              <img
                src={restaurant.Restaurant_Image}
                alt={restaurant.Restaurant_Name}
              />
            </div>

            <p className="restaurant-description">{restaurant.Description}</p>

            <div className="filter-section">
              <ToggleButtonGroup
                value={selection}
                exclusive
                onChange={handleSelection}
                aria-label="food type selection"
              >
                <ToggleButton value="veg">Veg</ToggleButton>
                <ToggleButton value="nonveg">Non-Veg</ToggleButton>
              </ToggleButtonGroup>
            </div>

            {hasAnyDishes() ? (
              <div className="menu-sections">
                {Object.keys(restaurant.Dishes).map((category) => {
                  const filteredDishes = filterDishes(
                    restaurant.Dishes[category]
                  );
                  if (filteredDishes.length > 0) {
                    return (
                      <div key={category} className="menu-section">
                        <h2>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h2>
                        <ul>
                          {filteredDishes.map((item, index) => (
                            <li className="dish-card" key={index}>
                              <div className="dish-content">
                                <div className="dish-image">
                                  <img
                                    className="dish-image"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="dish-details">
                                  <p className="dish-name">{item.name}</p>
                                  <p className="dish-rating">
                                    Rating: {item.rating}
                                  </p>
                                </div>
                              </div>
                              <div className="dish-bottom">
                                <p className="dish-price">
                                  Price: ₹{item.price}
                                </p>
                                <p
                                  className={`dish-type ${
                                    item.type === "veg" ? "veg" : "non-veg"
                                  }`}
                                >
                                  {item.type === "veg" ? "Veg" : "Non-Veg"}
                                </p>
                                <button onClick={() => addToCart(item)}>
                                  Add to Cart
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <p>We don't serve that dish.</p>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}

        <button className="cart-button" onClick={() => setIsModalOpen(true)}>
          <ShoppingCart className="cart-icon" />
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="cart-modal">
            <div className="modal-header">
              <div className="header-content">
                <ShoppingBag className="shopping-bag-icon" />
                <h2>Your Cart</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">Your cart is empty</div>
              ) : (
                <div className="items-container">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p className="restaurant-name">
                          {item.restaurantName}
                        </p>
                        <p className="item-price">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => removeFromCart(item.name)}>
                          <Minus className="quantity-icon" />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>
                          <Plus className="quantity-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="total">
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <button className="order-button" onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
