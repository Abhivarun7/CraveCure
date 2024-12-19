require('dotenv').config(); // Ensure you have a .env file with DB_URI
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const connectDB = require('./db'); // Import database connection
const authRoutes = require('./routes/auth'); // Import authentication routes
const foodRoutes = require('./routes/food');
const User = require('./models/users');
const Restaurant = require("./models/Restaurant.js");
const path = require('path'); // Add this line
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Route to create a new user
app.post('/user', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Authentication routes
app.use('/api', authRoutes); // Use authentication routes under /api

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Fetch all restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// Fetch a specific restaurant by ID
app.get("/api/restaurants/:id", async (req, res) => {
  console.log("Received restaurant ID:", req.params.id); // Log the received ID
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ message: "Error fetching restaurant details" });
  }
});

app.get('/search', async (req, res) => {
  const { query, location } = req.query;
  try {
    const restaurants = await Restaurant.find({
      Restaurant_Name: { $regex: query, $options: 'i' },
      Location: { $regex: location, $options: 'i' }
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).send('Error fetching search results');
  }
});


app.get('/api/dishes/:category', async (req, res) => {
  console.log('Request received to fetch dishes for category:', req.params.category);
  try {
    const { category } = req.params;

    console.log('Connecting to the database...');
    const restaurants = await Restaurant.find();  // Changed to find all restaurants
    console.log('Fetched restaurants:', JSON.stringify(restaurants, null, 2));

    if (restaurants.length === 0) {
      console.log('No restaurants found.');
      return res.status(404).json({ message: 'No restaurants found.' });
    }

    console.log(`Looking for category: ${category}`);

    const result = [];

    // Loop through all restaurants to find dishes in the specified category
    for (let restaurant of restaurants) {
      console.log('Restaurant Dishes structure:', restaurant.dishes);
      const dishes = restaurant.dishes[category]; // Get dishes from the specified category

      if (Array.isArray(dishes) && dishes.length > 0) {
        console.log(`Dishes found in category ${category} for restaurant:`, dishes);
        result.push({
          restaurantName: restaurant.name,
          category: category,
          dishName: dishes[0].name,
          image: dishes[0].image,
          rating: dishes[0].rating,
        });
      }
    }

    if (result.length > 0) {
      return res.json(result);
    } else {
      console.log(`No dishes available in category: ${category}`);
      return res.status(404).json({ message: `No dishes available in ${category}.` });
    }
  } catch (error) {
    console.error('Error occurred while fetching dishes:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.get('/fetch-dishes/:category', async (req, res) => {
  try {
    const category = req.query.category;  // e.g., 'biryani'
    
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Query the database for restaurants that have dishes in the requested category
    const restaurants = await Restaurant.find({
      [`Dishes.${category}`]: { $exists: true, $ne: [] }
    });

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found for this category' });
    }

    // Process the restaurants and return only the first dish from the requested category
    const result = restaurants.map(restaurant => {
      const dish = restaurant.Dishes[category][0]; // Get the first dish in the requested category
      if (dish) {
        return {
          restaurantName: restaurant.Restaurant_Name,
          dishName: dish.name,
          dishRating: dish.rating,
          dishImage: dish.image,
          restaurantDescription: restaurant.Description,
          restaurantLocation: restaurant.Location,
          restaurantRating: restaurant.Rating,
          restaurantImage: restaurant.Restaurant_Image
        };
      }
    }).filter(Boolean); // Remove any undefined entries if a restaurant has no dish in the category

    // Send the filtered data back to the client
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// API routes for food-related endpoints
app.use('/api/food', foodRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
