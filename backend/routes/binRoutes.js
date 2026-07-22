const express = require('express');
const router = express.Router();
const { getBins, seedBins } = require('../controllers/binController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBins);
router.route('/seed').post(protect, admin, seedBins);

module.exports = router;
