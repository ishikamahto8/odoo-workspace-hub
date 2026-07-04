const express = require('express');
const router = express.Router();

const { authenticate, restrictTo } = require('../middleware/auth');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const payrollController = require('../controllers/payrollController');

// Auth routes
router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);

// Profile routes
router.get('/profile/me', authenticate, profileController.getMe);
router.patch('/profile/me', authenticate, profileController.updateMe);
router.get('/profiles', authenticate, restrictTo('HR'), profileController.getAllProfiles);
router.patch('/profiles/:id', authenticate, restrictTo('HR'), profileController.updateProfileByAdmin);

// Attendance routes
router.post('/attendance/checkin', authenticate, attendanceController.checkIn);
router.post('/attendance/checkout', authenticate, attendanceController.checkOut);
router.get('/attendance/me', authenticate, attendanceController.getMyAttendance);
router.get('/attendance', authenticate, restrictTo('HR'), attendanceController.getAllAttendance);

// Leave routes
router.post('/leaves', authenticate, leaveController.applyLeave);
router.get('/leaves', authenticate, restrictTo('HR'), leaveController.getAllLeaves);
router.get('/leaves/me', authenticate, leaveController.getMyLeaves);
router.patch('/leaves/:id/review', authenticate, restrictTo('HR'), leaveController.reviewLeave);

// Payroll routes
router.get('/payroll/me', authenticate, payrollController.getMyPayroll);
router.patch('/payroll/:id', authenticate, restrictTo('HR'), payrollController.updatePayrollStructure);

module.exports = router;
