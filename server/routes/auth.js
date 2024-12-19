// auth.js (backend)
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/users');
const router = express.Router();

const cors = require('cors');
router.use(cors());


// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if token exists in user's tokens array
        const tokenExists = user.tokens.some(t => t.token === token);
        if (!tokenExists) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Login route
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Add new token to user's tokens array
        user.tokens.push({ token });
        await user.save();

        res.json({
            token,
            user: {
                name: user.name,
                location: user.location
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user data route
router.get('/auth/me', authenticate, (req, res) => {
    const { name, location, email } = req.user;
    res.json({ name, location, email });
});


router.get('/auth/prevorder', authenticate, (req, res) => {
    const { orders } = req.user;
    
    if (!orders) {
        return res.status(404).json({ message: 'No orders found' });
    }

    res.json({ orders });
});


// Update location route
router.post('/auth/update-location', authenticate, async (req, res) => {
    try {
        const { location } = req.body;
        req.user.location = location;
        await req.user.save();
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location' });
    }
});

// Backend: auth.js
router.post('/auth/add-order', authenticate, async (req, res) => {
    try {
        const { order } = req.body;
        
        if (!order || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // Process the order items
        const orderItems = order.map(item => ({
            item: item.name,
            quantity: item.quantity,
            amount: item.price
        }));

        // Calculate total amount
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.amount * item.quantity);
        }, 0);

        // Create new order object
        const newOrder = {
            restaurantName: order[0].restaurantName,
            items: orderItems,
            totalAmount: totalAmount,
            status: 'Pending',
            orderDate: new Date()
        };

        // Add the order to user's orders array
        req.user.orders.push(newOrder);
        await req.user.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });

    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ success: false, message: 'Error placing order' });
    }
});

// Logout route
router.post('/auth/logout', authenticate, async (req, res) => {
    try {
        // Remove the current token from the user's tokens array
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout' });
    }
});

module.exports = router;