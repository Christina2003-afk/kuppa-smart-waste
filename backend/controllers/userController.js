const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch users' });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update user role' });
  }
};

// @desc    Add transaction and update wallet
// @route   POST /api/users/:id/transaction
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { type, amount, desc } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      // Initialize default values for legacy documents
      if (user.walletBalance === undefined || isNaN(user.walletBalance)) {
        user.walletBalance = 500;
      }
      if (!user.transactions) {
        user.transactions = [];
      }

      if (type === 'recharge') {
        user.walletBalance += Number(amount);
      } else if (type === 'disposal') {
        user.walletBalance -= Number(amount);
      }

      // Add to beginning of array so newest is first
      user.transactions.unshift({
        type,
        amount: Number(amount),
        desc,
        date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })
      });

      // Keep only last 20 transactions to save space
      if (user.transactions.length > 20) {
        user.transactions = user.transactions.slice(0, 20);
      }

      const updatedUser = await user.save();
      
      res.json({
        walletBalance: updatedUser.walletBalance,
        transactions: updatedUser.transactions
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Add Transaction Error:', error);
    res.status(500).json({ message: 'Server Error: Could not update wallet' });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  addTransaction
};
