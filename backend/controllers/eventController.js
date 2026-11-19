const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events with search, category filter, date filter, and pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      dateFilter,
      sort,
      status,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Date filtering
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dateFilter === 'upcoming') {
      query.eventDate = { $gte: todayStart };
    } else if (dateFilter === 'today') {
      query.eventDate = { $gte: todayStart, $lte: todayEnd };
    } else if (dateFilter === 'week') {
      const nextWeek = new Date(todayStart);
      nextWeek.setDate(nextWeek.getDate() + 7);
      query.eventDate = { $gte: todayStart, $lte: nextWeek };
    } else if (dateFilter === 'month') {
      const nextMonth = new Date(todayStart);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      query.eventDate = { $gte: todayStart, $lte: nextMonth };
    } else if (dateFilter === 'past') {
      query.eventDate = { $lt: todayStart };
    }

    // Search filter (keyword in title, description, organizer, or venue)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { organizer: searchRegex },
        { venue: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { eventDate: 1 }; // default: upcoming first
    if (sort === 'date-desc') {
      sortOption = { eventDate: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'popular') {
      sortOption = { registeredCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: events.length,
      totalEvents,
      totalPages: Math.ceil(totalEvents / limitNum) || 1,
      currentPage: pageNum,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      eventDate,
      eventTime,
      venue,
      organizer,
      capacity,
      image,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !eventDate ||
      !eventTime ||
      !venue ||
      !organizer ||
      !capacity
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required event details',
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category,
      eventDate: new Date(eventDate),
      eventTime: eventTime.trim(),
      venue: venue.trim(),
      organizer: organizer.trim(),
      capacity: Number(capacity),
      registeredCount: 0,
      image: image && image.trim() !== '' ? image.trim() : undefined,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const {
      title,
      description,
      category,
      eventDate,
      eventTime,
      venue,
      organizer,
      capacity,
      image,
      status,
      tags,
    } = req.body;

    // Check capacity adjustment
    if (capacity !== undefined) {
      const newCapacity = Number(capacity);
      if (newCapacity < event.registeredCount) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than current registered students (${event.registeredCount})`,
        });
      }
      event.capacity = newCapacity;
    }

    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (category) event.category = category;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (eventTime) event.eventTime = eventTime.trim();
    if (venue) event.venue = venue.trim();
    if (organizer) event.organizer = organizer.trim();
    if (image) event.image = image.trim();
    if (status) event.status = status;
    if (tags !== undefined) {
      event.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];
    }

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Cascade delete all associated registrations
    await Registration.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
