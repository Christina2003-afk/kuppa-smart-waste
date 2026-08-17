const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/predict', protect, aiController.predictFillLevel);

module.exports = router;
