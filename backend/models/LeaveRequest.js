const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Sick Leave', 'Vacation', 'Personal', 'Personal Emergency', 'Other'],
    required: true,
  },
  dateStr: {
    type: String,
    required: true, // E.g., 'Aug 14, 2026' or 'Aug 18 - 20, 2026'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending',
  }
}, {
  timestamps: true,
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
