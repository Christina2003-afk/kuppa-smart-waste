const ExchangeItem = require('../models/ExchangeItem');

// @desc    Get all exchange items
// @route   GET /api/exchange
// @access  Public
const getItems = async (req, res) => {
  try {
    const items = await ExchangeItem.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new exchange item
// @route   POST /api/exchange
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, amount } = req.body;

    if (!title || !description || !category || !type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = new ExchangeItem({
      title,
      description,
      category,
      type,
      amount: amount || 0,
      user: req.user._id // from auth middleware
    });

    const createdItem = await item.save();
    
    // Populate user before sending back so frontend can render immediately
    await createdItem.populate('user', 'name');

    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Accept an exchange item
// @route   PUT /api/exchange/:id/accept
// @access  Private
const acceptItem = async (req, res) => {
  try {
    const item = await ExchangeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = 'Accepted';
    const updatedItem = await item.save();
    
    await updatedItem.populate('user', 'name');

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getItems,
  createItem,
  acceptItem
};
