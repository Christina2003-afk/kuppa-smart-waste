const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { binId, binLocationName, issueCategory, description, photoUrl } = req.body;

    if (!binId || !binLocationName || !issueCategory || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const report = await Report.create({
      binId,
      binLocationName,
      issueCategory,
      description,
      photoUrl,
      status: 'Pending',
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(`Error in createReport: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    // Sort by newest first
    const reports = await Report.find({}).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(`Error in getReports: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createReport,
  getReports
};
