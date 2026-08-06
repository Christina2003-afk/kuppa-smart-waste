const mongoose = require('mongoose');

const exchangeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Egg Shells', 'Banana Peels', 'Coffee Grounds', 'Dry Leaves', 'Wood Ash', 'Vegetable Waste', 'Coconut Shell', 'Sugarcane Bagasse', 'Compost', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['Available', 'Requested'] // Available = Seller offering, Requested = Buyer requesting
  },
  quantity: {
    type: String,
    required: true,
    default: '1kg'
  },
  location: {
    type: String,
    required: true,
    default: 'Community Center'
  },
  amount: { // Expected Price or Offered Reward
    type: Number,
    required: true,
    default: 0
  },
  platformCommission: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted by Seller', 'Pending Buyer Approval', 'Pickup Scheduled', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  // The creator of the listing/request
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The person who accepted/fulfilled it
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  offeredImage: {
    type: String
  },
  offeredLocation: {
    type: String
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ExchangeItem', exchangeItemSchema);
