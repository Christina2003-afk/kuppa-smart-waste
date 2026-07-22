const mongoose = require('mongoose');

const binSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    district: {
      type: String,
      required: true,
    },
    fillLevel: {
      type: Number,
      required: true,
      default: 0, // 0 to 100
    },
    batteryLevel: {
      type: Number,
      required: true,
      default: 100, // 0 to 100
    },
    lastEmptied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Offline'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

// Create a geospatial index on the location field
binSchema.index({ location: '2dsphere' });

const Bin = mongoose.model('Bin', binSchema);
module.exports = Bin;
