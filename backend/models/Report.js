const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bin',
    required: true,
  },
  binLocationName: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional because public users might report anonymously
  },
  issueCategory: {
    type: String,
    enum: ['Sensor Failure', 'Physical Damage', 'Road Blocked / Inaccessible', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Investigating', 'Resolved'],
    default: 'Pending',
  },
  photoUrl: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
