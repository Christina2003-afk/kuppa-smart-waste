const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../backend/models/User');
const jwt = require('jsonwebtoken');

dotenv.config({ path: '../backend/.env' });

const testPost = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const staff = await User.findOne({ role: 'Staff' });
    if (!staff) {
      console.log('No staff found');
      return;
    }
    const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const res = await axios.post('http://localhost:5001/api/staff-ops/leaves', {
      type: 'Personal Emergency',
      dateStr: '27-08-2026',
      reason: 'Going for family function'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Success!', res.data);
  } catch (error) {
    console.error('Failed to post:', error.response?.data || error.message);
  } finally {
    process.exit();
  }
};

testPost();
