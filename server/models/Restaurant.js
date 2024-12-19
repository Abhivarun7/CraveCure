const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  image: { type: String, required: true },
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  image: { type: String, required: true },
  dishes: {
    biryani: [DishSchema],
    curries: [DishSchema],
    starters: [DishSchema],
    rice: [DishSchema],
    desserts: [DishSchema],
    beverages: [DishSchema],
    tandooris: [DishSchema],
    naans: [DishSchema],
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
