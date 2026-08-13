const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LeaveRequest = require('../backend/models/LeaveRequest');
const Assignment = require('../backend/models/Assignment');
const User = require('../backend/models/User');

dotenv.config({ path: '../backend/.env' });

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const leaves = await LeaveRequest.find();
    console.log('Leaves:', leaves);

    const assignments = await Assignment.find().populate('staffId');
    console.log('Assignments:', assignments.length);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
