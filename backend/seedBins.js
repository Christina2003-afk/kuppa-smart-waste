const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bin = require('./models/Bin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedBins = async () => {
  try {
    await Bin.deleteMany();
    console.log('Cleared existing bins');

    const dummyBins = [
      // Ernakulam Bins
      { name: "Marine Drive Central Bin", district: "Ernakulam", location: { type: "Point", coordinates: [76.2731, 9.9798] }, fillLevel: 45, batteryLevel: 80 },
      { name: "Edappally Metro Bin", district: "Ernakulam", location: { type: "Point", coordinates: [76.3082, 10.0261] }, fillLevel: 92, batteryLevel: 30 },
      { name: "Kakkanad InfoPark Bin", district: "Ernakulam", location: { type: "Point", coordinates: [76.3533, 10.0094] }, fillLevel: 60, batteryLevel: 95 },
      
      // Kottayam Bins
      { name: "Thirunakkara Temple Bin", district: "Kottayam", location: { type: "Point", coordinates: [76.5222, 9.5916] }, fillLevel: 75, batteryLevel: 40 },
      { name: "CMS College Area Bin", district: "Kottayam", location: { type: "Point", coordinates: [76.5200, 9.5950] }, fillLevel: 20, batteryLevel: 100 },
      { name: "Kottayam Railway Station Bin", district: "Kottayam", location: { type: "Point", coordinates: [76.5250, 9.5850] }, fillLevel: 95, batteryLevel: 15 },
      
      // Trivandrum Bins
      { name: "Technopark Phase 1 Bin", district: "Thiruvananthapuram", location: { type: "Point", coordinates: [76.8833, 8.5581] }, fillLevel: 55, batteryLevel: 70 },
      { name: "Kowdiar Palace Bin", district: "Thiruvananthapuram", location: { type: "Point", coordinates: [76.9533, 8.5281] }, fillLevel: 85, batteryLevel: 25 },
      { name: "East Fort Market Bin", district: "Thiruvananthapuram", location: { type: "Point", coordinates: [76.9450, 8.4833] }, fillLevel: 100, batteryLevel: 5 }
    ];

    await Bin.insertMany(dummyBins);
    console.log('Seeded bins successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedBins();
