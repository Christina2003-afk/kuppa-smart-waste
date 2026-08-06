const mongoose = require('mongoose');
const Bin = require('./models/Bin');
const dotenv = require('dotenv');

dotenv.config();

const kottayamBins = [
  {
    name: 'Kanjirappally Town Junction',
    location: {
      type: 'Point',
      coordinates: [76.792, 9.555] // [longitude, latitude]
    },
    district: 'Kottayam',
    fillLevel: 95, // High priority
    batteryLevel: 80,
    status: 'Active'
  },
  {
    name: 'Ponkunnam Road Bus Stop',
    location: {
      type: 'Point',
      coordinates: [76.775, 9.565]
    },
    district: 'Kottayam',
    fillLevel: 85, // Medium/High priority
    batteryLevel: 90,
    status: 'Active'
  },
  {
    name: 'Amal Jyothi College Road',
    location: {
      type: 'Point',
      coordinates: [76.825, 9.525]
    },
    district: 'Kottayam',
    fillLevel: 92, // High priority
    batteryLevel: 65,
    status: 'Active'
  },
  {
    name: 'Erumely Main Market',
    location: {
      type: 'Point',
      coordinates: [76.810, 9.530]
    },
    district: 'Kottayam',
    fillLevel: 45, // Low priority (skip)
    batteryLevel: 95,
    status: 'Active'
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Connected');
  
  // Insert new bins
  try {
    const inserted = await Bin.insertMany(kottayamBins);
    console.log(`Successfully added ${inserted.length} bins in Kottayam/Kanjirappally.`);
  } catch (err) {
    console.error('Error inserting bins:', err);
  }
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Connection Error:', err);
});
