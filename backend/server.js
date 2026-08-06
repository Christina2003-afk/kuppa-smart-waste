const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const binRoutes = require('./routes/binRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make the uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Base route
app.get('/', (req, res) => {
  res.send('KUPPA API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
