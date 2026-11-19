const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect, adminOnly, studentOnly } = require('../middleware/authMiddleware');

router.post('/', protect, studentOnly, registerForEvent);
router.get('/my', protect, studentOnly, getMyRegistrations);
router.get('/event/:eventId', protect, adminOnly, getEventRegistrations);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
