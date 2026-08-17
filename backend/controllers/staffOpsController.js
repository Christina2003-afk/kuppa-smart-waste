const Assignment = require('../models/Assignment');
const LeaveRequest = require('../models/LeaveRequest');
const Report = require('../models/Report');
const Payroll = require('../models/Payroll');


// Assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('staffId', 'name role');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const saved = await newAssignment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeStatus, completedStops, proofPhotoUrl } = req.body;
    const updated = await Assignment.findByIdAndUpdate(id, { routeStatus, completedStops, proofPhotoUrl }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Leave Requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('staffId', 'name role');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createLeaveRequest = async (req, res) => {
  try {
    // req.user comes from protect middleware
    const newLeave = new LeaveRequest({
      staffId: req.user._id,
      type: req.body.type,
      dateStr: req.body.dateStr,
    });
    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating leave:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Reported Issues
exports.getStaffReports = async (req, res) => {
  try {
    // Only fetch reports that were created by staff (have a reportedBy field)
    const reports = await Report.find({ reportedBy: { $exists: true } })
      .populate('reportedBy', 'name role')
      .populate('binId', 'name district location');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createStaffReport = async (req, res) => {
  try {
    const { binId, binLocationName, issueCategory, description } = req.body;
    const newReport = new Report({
      binId,
      binLocationName,
      issueCategory,
      description,
      reportedBy: req.user._id,
      status: 'Open' // Note: existing schema uses 'Pending', we'll map 'Open' to 'Pending' or just allow it
    });
    const saved = await newReport.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.resolveStaffReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Report.findByIdAndUpdate(id, { status: 'Resolved' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- PAYROLL METHODS ---

exports.getPayrollList = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('staffId', 'name email phone role');
    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    payroll.status = 'Paid';
    payroll.paidAt = Date.now();
    await payroll.save();
    
    res.json(payroll);
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
