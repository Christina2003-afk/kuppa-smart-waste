const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// NOTE: The client ID should ideally come from environment variables.
// Using a placeholder that the user will replace with their actual Google Client ID.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '793436865811-k2374uia2buucopleqe0tqmt0stp38aj.apps.googleusercontent.com');
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Role is intentionally omitted from req.body destructuring to force 'User'
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits and start with 6, 7, 8, or 9' });
    }
    
    if (/^(\d)\1{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number cannot be all identical digits' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: 'User',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        walletBalance: user.walletBalance,
        transactions: user.transactions,
        totalDisposals: user.totalDisposals,
        ecoPoints: user.ecoPoints,
        rfidStatus: user.rfidStatus,
        rfidNumber: user.rfidNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        walletBalance: user.walletBalance,
        transactions: user.transactions,
        totalDisposals: user.totalDisposals,
        ecoPoints: user.ecoPoints,
        rfidStatus: user.rfidStatus,
        rfidNumber: user.rfidNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || '793436865811-k2374uia2buucopleqe0tqmt0stp38aj.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      // Since it's Google Auth, we generate a random password and set default fields
      const randomPassword = googleId + process.env.JWT_SECRET;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        phone: 'Not Provided',
        address: 'Not Provided',
        password: hashedPassword,
        role: 'User',
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      walletBalance: user.walletBalance,
      transactions: user.transactions,
      totalDisposals: user.totalDisposals,
      ecoPoints: user.ecoPoints,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

const sendEmail = require('../utils/sendEmail');

// @desc    Forgot Password (Send Real Email)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Security best practice: Don't reveal if email exists or not
      return res.status(200).json({ message: 'Password reset instructions have been sent to your email!' });
    }

    // Generate a random 6-digit temporary password
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash it and save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);
    user.password = hashedPassword;
    await user.save();

    // Create a beautiful HTML email
    const message = `You are receiving this email because you requested a password reset for your KuPPA account. Your temporary password is: ${tempPassword}`;
    
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2e7d32;">KuPPA Account Recovery</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested a password reset for your account associated with this email.</p>
        <p>Your temporary password is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${tempPassword}</h1>
        </div>
        <p>Please log in using this temporary password and change it immediately from your dashboard settings.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">If you did not request a password reset, please ignore this email or contact support.</p>
      </div>
    `;

    try {
      const previewUrl = await sendEmail({
        email: user.email,
        subject: 'KuPPA - Password Reset',
        message,
        html: htmlMessage
      });

      res.status(200).json({ 
        message: 'Password reset instructions have been sent to your email!',
        previewUrl: previewUrl
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      return res.status(500).json({ message: 'Error sending email. Please try again.' });
    }

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server Error: Could not process request' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  googleAuth,
  forgotPassword,
};
