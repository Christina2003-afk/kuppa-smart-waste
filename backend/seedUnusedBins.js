const mongoose = require('mongoose');

const binSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    district: { type: String, required: true },
    fillLevel: { type: Number, required: true, default: 0 },
    batteryLevel: { type: Number, required: true, default: 100 },
    status: { type: String, enum: ['Active', 'Maintenance', 'Offline'], default: 'Active' }
  },
  { timestamps: true }
);

const Bin = mongoose.models.Bin || mongoose.model('Bin', binSchema);

const updateUnusedBins = async () => {
  try {
    await mongoose.connect('mongodb://karthikarajan2903_db_user:mZ6OO7vu7CKUocXk@ac-r6i0cuy-shard-00-00.t9d3ofs.mongodb.net:27017,ac-r6i0cuy-shard-00-01.t9d3ofs.mongodb.net:27017,ac-r6i0cuy-shard-00-02.t9d3ofs.mongodb.net:27017/kuppa?ssl=true&replicaSet=atlas-z9a6zq-shard-0&authSource=admin&retryWrites=true&w=majority');
    console.log('MongoDB Connected');

    // Remove the old dummy unused ones
    await Bin.deleteMany({ fillLevel: { $lte: 10 } });

    // Pathanamthitta Coordinates (roughly ~ 9.2, 76.7)
    const unusedBins = [
      {
        name: 'Adoor KSRTC Underpass',
        location: { type: 'Point', coordinates: [76.7350, 9.1620] },
        district: 'Pathanamthitta',
        fillLevel: 5,
        batteryLevel: 98,
        status: 'Active'
      },
      {
        name: 'Ranni River Bank',
        location: { type: 'Point', coordinates: [76.7865, 9.3850] },
        district: 'Pathanamthitta',
        fillLevel: 2,
        batteryLevel: 95,
        status: 'Active'
      },
      {
        name: 'Thiruvalla Remote Bypass',
        location: { type: 'Point', coordinates: [76.5740, 9.3830] },
        district: 'Pathanamthitta',
        fillLevel: 8,
        batteryLevel: 99,
        status: 'Active'
      },
      {
        name: 'Kozhencherry Old Market',
        location: { type: 'Point', coordinates: [76.6900, 9.3300] },
        district: 'Pathanamthitta',
        fillLevel: 0,
        batteryLevel: 100,
        status: 'Active'
      }
    ];

    await Bin.insertMany(unusedBins);
    console.log('Successfully inserted 4 Pathanamthitta underutilized bins!');
    process.exit();
  } catch (error) {
    console.error('Error seeding bins:', error);
    process.exit(1);
  }
};

updateUnusedBins();
