const express = require('express');
const router = express.Router();
const { getItems, createItem, acceptItem } = require('../controllers/exchangeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id/accept')
  .put(protect, acceptItem);

module.exports = router;
