const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const staffOpsController = require('../controllers/staffOpsController');

// Assignments
router.route('/assignments')
  .get(protect, staffOpsController.getAssignments)
  .post(protect, admin, staffOpsController.createAssignment);

router.route('/assignments/:id')
  .put(protect, staffOpsController.updateAssignmentStatus);

// Leaves
router.route('/leaves')
  .get(protect, staffOpsController.getLeaveRequests)
  .post(protect, staffOpsController.createLeaveRequest);

router.route('/leaves/:id')
  .put(protect, admin, staffOpsController.updateLeaveStatus);

// Issues / Reports
router.route('/reports')
  .get(protect, admin, staffOpsController.getStaffReports)
  .post(protect, staffOpsController.createStaffReport);

router.route('/reports/:id/resolve')
  .put(protect, admin, staffOpsController.resolveStaffReport);

// Payroll
router.route('/payroll')
  .get(protect, admin, staffOpsController.getPayrollList);

router.route('/payroll/:id/pay')
  .put(protect, admin, staffOpsController.processPayment);

module.exports = router;
