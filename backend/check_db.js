const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("Users in DB:");
  users.forEach(u => console.log(`Email: ${u.email} | Role: ${u.role}`));
  process.exit(0);
}
check();
