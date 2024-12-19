import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Store, IndianRupee } from 'lucide-react'; // Changed Restaurant to Store
import './Orders.css';

const PrevOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'delivered'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error("No token found. Please login first.");
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3001/api/auth/prevorder', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Access the 'orders' array from the response
      setOrders(response.data.orders || []); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  
const getFilteredOrders = () => {
  if (!Array.isArray(orders)) return []; // Safeguard against non-array values

  let filteredOrders = [...orders];

  if (filter !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status.toLowerCase() === filter);
  }

  filteredOrders.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.orderDate) - new Date(a.orderDate);
      case 'date-asc':
        return new Date(a.orderDate) - new Date(b.orderDate);
      case 'amount-desc':
        return b.totalAmount - a.totalAmount;
      case 'amount-asc':
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  return filteredOrders;
};


  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>

      <div className="orders-controls">
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {getFilteredOrders().length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-list">
          {getFilteredOrders().map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <h3><Store className="icon" /> {order.restaurantName}</h3>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <p><Calendar className="icon" /> {formatDate(order.orderDate)}</p>
                  <p><Clock className="icon" /> {formatTime(order.orderDate)}</p>
                  <p><IndianRupee className="icon" /> {order.totalAmount}</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, itemIndex) => (
                      <li key={`${item.item}-${itemIndex}`}>
                        {item.item} x {item.quantity} - ₹{item.amount * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrevOrders;
