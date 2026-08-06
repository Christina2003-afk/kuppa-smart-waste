const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, addTransaction, requestRFID, getRFIDRequests, approveRFID } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id/transaction').post(protect, addTransaction);
router.route('/request-rfid').post(protect, requestRFID);
router.route('/rfid-requests').get(protect, admin, getRFIDRequests);
router.route('/approve-rfid/:id').post(protect, admin, approveRFID);

module.exports = router;
