const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String,
    required: true, // E.g., 'August 2026'
  },
  baseSalary: {
    type: Number,
    required: true,
    default: 15000,
  },
  performanceBonus: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  netPay: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  paidAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

// Calculate netPay before saving if not provided explicitly
payrollSchema.pre('validate', function() {
  if (this.baseSalary != null) {
    this.netPay = this.baseSalary + (this.performanceBonus || 0) - (this.deductions || 0);
  }
});

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;
