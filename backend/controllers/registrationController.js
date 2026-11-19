const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register student for an event (concurrency-safe seat allocation)
// @route   POST /api/registrations
// @access  Private/Student
const registerForEvent = async (req, res, next) => {
  let seatAllocated = false;
  let targetEventId = null;

  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required to register',
      });
    }

    targetEventId = eventId;

    // 1. Check if event exists and is upcoming
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This event has been cancelled and is no longer accepting registrations',
      });
    }

    if (event.status === 'completed' || new Date(event.eventDate) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'This event has already concluded',
      });
    }

    // 2. Check if student already has an active registration
    const existingRegistration = await Registration.findOne({
      studentId,
      eventId,
      status: 'registered',
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // 3. Concurrency-safe atomic seat increment using $expr: registeredCount < capacity
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ['$registeredCount', '$capacity'] },
      },
      {
        $inc: { registeredCount: 1 },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Event capacity is full! No seats currently available.',
      });
    }

    seatAllocated = true;

    // 4. Create or reactivate the registration
    // If a previously cancelled registration existed, update it; otherwise create new
    let registration = await Registration.findOne({ studentId, eventId });

    if (registration) {
      registration.status = 'registered';
      registration.registrationDate = new Date();
      registration.cancellationReason = '';
      await registration.save();
    } else {
      registration = await Registration.create({
        studentId,
        eventId,
        registrationDate: new Date(),
        status: 'registered',
      });
    }

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('eventId')
      .populate('studentId', 'name email department phone studentIdNumber');

    res.status(201).json({
      success: true,
      message: `Successfully registered for "${updatedEvent.title}"!`,
      registration: populatedRegistration,
      seatsLeft: updatedEvent.capacity - updatedEvent.registeredCount,
    });
  } catch (error) {
    // If seat was incremented but registration record failed, rollback seat count
    if (seatAllocated && targetEventId) {
      try {
        await Event.findByIdAndUpdate(targetEventId, { $inc: { registeredCount: -1 } });
      } catch (rollbackError) {
        console.error('Error rolling back seat allocation:', rollbackError);
      }
    }
    next(error);
  }
};

// @desc    Get currently logged-in student's registrations
// @route   GET /api/registrations/my
// @access  Private/Student
const getMyRegistrations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { studentId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .sort({ registrationDate: -1 })
      .populate({
        path: 'eventId',
        select: 'title description category eventDate eventTime venue organizer image status capacity registeredCount',
      });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
const getEventRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const registrations = await Registration.find({ eventId })
      .sort({ registrationDate: -1 })
      .populate('studentId', 'name email department phone studentIdNumber createdAt');

    res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
        eventDate: event.eventDate,
        venue: event.venue,
      },
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a registration (concurrency-safe seat restoration)
// @route   DELETE /api/registrations/:id
// @access  Private
const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    // Verify permission: Student cancelling their own or Admin
    const isOwner = registration.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this registration',
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration is already cancelled',
      });
    }

    // Mark registration as cancelled
    registration.status = 'cancelled';
    registration.cancellationReason =
      (req.body && req.body.reason) ||
      (isAdmin ? 'Cancelled by administrator' : 'Cancelled by student');
    await registration.save();

    // Concurrency-safe seat decrement (ensure registeredCount does not drop below 0)
    await Event.findOneAndUpdate(
      { _id: registration.eventId, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Registration successfully cancelled, seat released',
      registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
