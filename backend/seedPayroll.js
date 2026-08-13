const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Payroll = require('./models/Payroll');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const seedPayroll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for payroll seeding');

    // Get staff users
    const staff = await User.find({ role: 'Staff' });
    if (staff.length === 0) {
      console.log('No staff found. Please create staff first.');
      process.exit(1);
    }

    // Clear existing
    await Payroll.deleteMany();

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., 'August 2026'

    for (let i = 0; i < staff.length; i++) {
      await Payroll.create({
        staffId: staff[i]._id,
        month: currentMonth,
        baseSalary: 15000 + (Math.random() * 5000), // Base between 15000 and 20000
        performanceBonus: Math.random() > 0.5 ? Math.floor(Math.random() * 3000) : 0, // 50% chance of bonus
        deductions: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : 0, // 30% chance of deduction
        status: Math.random() > 0.5 ? 'Pending' : 'Paid',
        paidAt: Math.random() > 0.5 ? Date.now() : null
      });
    }

    console.log('Seeded payroll successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPayroll();
