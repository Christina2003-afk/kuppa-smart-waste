const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, googleAuth, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);

module.exports = router;
