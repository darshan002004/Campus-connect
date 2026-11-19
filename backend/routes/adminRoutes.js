const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getStudents,
  getAllRegistrations,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/students', getStudents);
router.get('/registrations', getAllRegistrations);

module.exports = router;
