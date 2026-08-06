const ExchangeItem = require('../models/ExchangeItem');
const User = require('../models/User');

// @desc    Get all exchange items
// @route   GET /api/exchange
// @access  Public
const getItems = async (req, res) => {
  try {
    const items = await ExchangeItem.find({})
      .populate('user', 'name email phone')
      .populate('fulfilledBy', 'name email phone')
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
    const { title, description, category, type, amount, quantity, location } = req.body;

    if (!title || !description || !category || !type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = new ExchangeItem({
      title,
      description,
      category,
      type,
      amount: amount || 0,
      quantity: quantity || '1kg',
      location: location || 'Community Center',
      user: req.user._id,
      status: 'Pending' // Initial state
    });

    const createdItem = await item.save();
    await createdItem.populate('user', 'name email phone');

    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update status (Admin Review / Status changes)
// @route   PUT /api/exchange/:id/status
// @access  Private
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await ExchangeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Usually we would check if req.user is an admin here
    const updatedItem = await ExchangeItem.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: false }
    );
    
    await updatedItem.populate('user', 'name email phone');
    if (updatedItem.fulfilledBy) {
      await updatedItem.populate('fulfilledBy', 'name email phone');
    }

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Accept/Fulfill an exchange item (Wallet integration)
// @route   PUT /api/exchange/:id/accept
// @access  Private
const acceptItem = async (req, res) => {
  try {
    const item = await ExchangeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'Approved') {
      return res.status(400).json({ message: 'Item must be approved by admin before it can be accepted.' });
    }

    if (item.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot accept your own listing.' });
    }

    if (item.type === 'Requested') {
      const { offeredImage, offeredLocation } = req.body;
      if (!offeredImage || !offeredLocation) {
        return res.status(400).json({ message: 'Please provide an image URL and location to fulfill this request.' });
      }
      
      item.fulfilledBy = req.user._id;
      item.offeredImage = offeredImage;
      item.offeredLocation = offeredLocation;
      item.status = 'Pending Buyer Approval';
      await item.save();
      
      return res.json({ message: 'Offer submitted for buyer approval.', item });
    }

    // Normal logic for 'Available' items (instant payment)
    const sellerId = item.user;
    const buyerId = req.user._id;

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(sellerId);

    const amount = item.amount || 0;
    const platformCommission = amount * 0.10;
    const sellerRevenue = amount - platformCommission;

    if (buyer.walletBalance < amount) {
      return res.status(400).json({ message: 'Buyer has insufficient wallet balance.' });
    }

    // Wallet Deductions & Additions
    buyer.walletBalance -= amount;
    buyer.transactions.push({
      type: 'exchange_payment',
      amount: -amount,
      desc: `Paid for ${item.category} (${item.title})`
    });

    seller.walletBalance += sellerRevenue;
    seller.transactions.push({
      type: 'exchange_earning',
      amount: sellerRevenue,
      desc: `Earned from ${item.category} (${item.title}) after 10% platform fee`
    });

    await buyer.save();
    await seller.save();

    // Update Item
    item.status = 'Accepted by Seller';
    item.fulfilledBy = req.user._id;
    item.platformCommission = platformCommission;
    
    const updatedItem = await item.save();
    
    await updatedItem.populate('user', 'name email phone');
    await updatedItem.populate('fulfilledBy', 'name email phone');

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve fulfillment offer and pay seller
// @route   PUT /api/exchange/:id/approve-fulfillment
// @access  Private
const approveFulfillment = async (req, res) => {
  try {
    const item = await ExchangeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'Pending Buyer Approval') {
      return res.status(400).json({ message: 'Item is not pending buyer approval.' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the original requester can approve this fulfillment.' });
    }

    const buyerId = item.user;
    const sellerId = item.fulfilledBy;

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(sellerId);

    const amount = item.amount || 0;
    const platformCommission = amount * 0.10;
    const sellerRevenue = amount - platformCommission;

    if (buyer.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance to approve.' });
    }

    // Wallet Deductions & Additions
    buyer.walletBalance -= amount;
    buyer.transactions.push({
      type: 'exchange_payment',
      amount: -amount,
      desc: `Paid for ${item.category} (${item.title}) fulfillment`
    });

    seller.walletBalance += sellerRevenue;
    seller.transactions.push({
      type: 'exchange_earning',
      amount: sellerRevenue,
      desc: `Earned from fulfilling ${item.category} (${item.title})`
    });

    await buyer.save();
    await seller.save();

    item.status = 'Completed';
    item.platformCommission = platformCommission;
    await item.save();

    res.json({ message: 'Fulfillment approved and payment sent!', item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getItems,
  createItem,
  updateStatus,
  acceptItem,
  approveFulfillment
};
