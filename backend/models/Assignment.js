const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  totalStops: {
    type: Number,
    required: true,
    default: 0
  },
  completedStops: {
    type: Number,
    required: true,
    default: 0
  },
  routeStatus: {
    type: String,
    enum: ['Starting', 'In Progress', 'Completed'],
    default: 'Starting',
  },
  proofPhotoUrl: {
    type: String,
    default: null,
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
