require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'chriszzz2003@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'Admin';
      await user.save();
      console.log(`Success! Updated existing user ${email} to Admin.`);
    } else {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);

      user = await User.create({
        name: 'Chris Admin',
        email,
        phone: 'Not Provided',
        address: 'Not Provided',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log(`Created new Admin account! Email: ${email}, Password: Admin@123`);
    }

    if (user) {
      console.log(`Success! Updated user ${email} to role: ${user.role}`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
};

makeAdmin();
