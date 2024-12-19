const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  tokens: [
    {
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  // In your users.js model
  location: { 
    type: String,
    default: ''
  },
  orders: [
    {
      restaurantName: { type: String, ref: 'Restaurant' },
      items: [
        {
          item: { type: String, ref: 'MenuItem' },
          quantity: { type: Number, required: true },
          amount:{type: Number, required: true}
        }
      ],
      totalAmount: { type: Number, required: true },
      orderDate: { type: Date, default: Date.now },
      status: { type: String, default: 'Pending' } // e.g., Pending, Delivered, Cancelled
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const UserModel = mongoose.model('foodies', UserSchema);

module.exports = UserModel;
