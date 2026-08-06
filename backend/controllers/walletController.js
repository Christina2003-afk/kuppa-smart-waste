const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay
// For testing, we can use dummy keys if env variables are missing.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret456',
});

// @desc    Create Razorpay Order
// @route   POST /api/wallet/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    
    const options = {
      amount: amount * 100, // Amount is in currency subunits (paise)
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
    };

    const isDummy = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummykey123';
    let order;

    if (isDummy) {
      // Create a mock order if no real keys are provided
      order = {
        id: `order_mock_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created"
      };
    } else {
      order = await razorpay.orders.create(options);
    }
    
    if (!order) {
      return res.status(500).json({ message: 'Some error occurred generating order' });
    }
    
    res.json({ 
      ...order, 
      isMock: isDummy,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123'
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: 'Failed to create order. Check backend keys.' });
  }
};

// @desc    Verify Payment and Top-up Wallet
// @route   POST /api/wallet/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount // Original amount in INR
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret456';
    
    // If real order, verify digest
    if (!razorpay_order_id.startsWith('order_mock_')) {
      // Create hmac to verify signature
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      // Comaparing our digest with the actual signature
      if (digest !== razorpay_signature) {
        return res.status(400).json({ message: 'Transaction not legit!' });
      }
    }

    // Payment is verified! Top up the user's wallet
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize arrays if they don't exist
    if (user.walletBalance === undefined || isNaN(user.walletBalance)) user.walletBalance = 0;
    if (!user.transactions) user.transactions = [];

    // Add funds
    user.walletBalance += Number(amount);
    
    // Log transaction
    user.transactions.unshift({
      type: 'recharge',
      amount: Number(amount),
      desc: razorpay_order_id.startsWith('order_mock_') ? `Mock Wallet Top-up (Test Mode)` : `Razorpay Top-up (Payment ID: ${razorpay_payment_id})`,
      date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })
    });

    // Keep only last 20
    if (user.transactions.length > 20) {
      user.transactions = user.transactions.slice(0, 20);
    }

    await user.save();

    res.json({
      message: 'Payment verified and wallet topped up successfully',
      walletBalance: user.walletBalance,
      transactions: user.transactions
    });
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
