const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../backend/models/Assignment');
const User = require('../backend/models/User');

dotenv.config({ path: '../backend/.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding');

    // Get staff users
    let staff = await User.find({ role: 'Staff' });
    if (staff.length === 0) {
      console.log('No staff found. Creating mock staff...');
      const s1 = await User.create({ name: 'Rahul T', email: 'rahul@kuppa.com', phone: '9999999999', password: '123', address: 'Kochi', role: 'Staff' });
      const s2 = await User.create({ name: 'Anjali V', email: 'anjali@kuppa.com', phone: '8888888888', password: '123', address: 'Kochi', role: 'Staff' });
      const s3 = await User.create({ name: 'Ajith M', email: 'ajith@kuppa.com', phone: '7777777777', password: '123', address: 'Kochi', role: 'Staff' });
      staff = [s1, s2, s3];
    }

    // Delete existing assignments
    await Assignment.deleteMany();

    const zones = ['Kochi North', 'Edappally', 'Kottayam Central', 'MG Road'];
    
    // Create new assignments
    for (let i = 0; i < staff.length; i++) {
      await Assignment.create({
        staffId: staff[i]._id,
        zone: zones[i % zones.length],
        totalStops: Math.floor(Math.random() * 10) + 5,
        completedStops: Math.floor(Math.random() * 5),
        routeStatus: ['Starting', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
      });
    }

    console.log('Seeded assignments successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
