const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bin = require('./models/Bin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const checkBins = async () => {
  const bins = await Bin.find({});
  console.log('Bins count:', bins.length);
  process.exit();
};

checkBins();
