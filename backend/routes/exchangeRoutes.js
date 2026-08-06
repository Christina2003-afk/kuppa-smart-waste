const express = require('express');
const router = express.Router();
const { getItems, createItem, acceptItem, updateStatus, approveFulfillment } = require('../controllers/exchangeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getItems);
router.post('/', protect, createItem);
router.put('/:id/accept', protect, acceptItem);
router.put('/:id/approve-fulfillment', protect, approveFulfillment);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
