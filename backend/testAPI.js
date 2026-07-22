const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const testAPI = async () => {
  const user = await User.findOne({ name: 'Mariya' });
  if (!user) {
    console.log('User Mariya not found');
    process.exit(1);
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  try {
    const res = await fetch('http://localhost:5000/api/bins', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log('Bins fetched successfully. Count:', data.length);
    } catch(e) {
      console.log('Received HTML:', text);
    }
  } catch (error) {
    console.error('Error fetching bins:', error.message);
  }
  
  process.exit();
};

testAPI();
