const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'User'
  },
  walletBalance: {
    type: Number,
    default: 500
  },
  totalDisposals: {
    type: Number,
    default: 0
  },
  ecoPoints: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['recharge', 'disposal', 'booking'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: String, // Storing formatted string for simplicity in frontend, or could use Date
      default: () => new Date().toLocaleString()
    },
    desc: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
