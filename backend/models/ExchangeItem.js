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
    maxLength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Available', 'Requested']
  },
  amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Accepted'],
    default: 'Open'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExchangeItem', exchangeItemSchema);
