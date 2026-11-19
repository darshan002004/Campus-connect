const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get aggregate analytics for Admin Dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      recentRegistrations,
      popularEvents,
      categoryStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Event.countDocuments(),
      Event.countDocuments({ eventDate: { $gte: today } }),
      Registration.countDocuments({ status: 'registered' }),
      Registration.find()
        .sort({ registrationDate: -1 })
        .limit(6)
        .populate('studentId', 'name email department phone')
        .populate('eventId', 'title category eventDate venue'),
      Event.find()
        .sort({ registeredCount: -1 })
        .limit(5)
        .select('title category capacity registeredCount eventDate venue status image'),
      Event.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalRegistrations: { $sum: '$registeredCount' },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalEvents,
          upcomingEvents,
          totalRegistrations,
        },
        recentRegistrations,
        popularEvents,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with registration metrics
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const query = { role: 'student' };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { studentIdNumber: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate registration counts per student
    const studentIds = students.map((s) => s._id);
    const regCounts = await Registration.aggregate([
      { $match: { studentId: { $in: studentIds }, status: 'registered' } },
      { $group: { _id: '$studentId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((rc) => {
      countMap[rc._id.toString()] = rc.count;
    });

    const studentsWithCounts = students.map((s) => ({
      ...s.toObject(),
      activeRegistrations: countMap[s._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: studentsWithCounts.length,
      students: studentsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations with search and filter
// @route   GET /api/admin/registrations
// @access  Private/Admin
const getAllRegistrations = async (req, res, next) => {
  try {
    const { status, eventId, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (eventId && eventId !== 'All') {
      query.eventId = eventId;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    let registrationsQuery = Registration.find(query)
      .sort({ registrationDate: -1 })
      .populate('studentId', 'name email department phone studentIdNumber')
      .populate('eventId', 'title category eventDate venue capacity registeredCount');

    let registrations = await registrationsQuery;

    // Filter by student name or event title if search query provided
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      registrations = registrations.filter(
        (r) =>
          (r.studentId && r.studentId.name && r.studentId.name.toLowerCase().includes(term)) ||
          (r.studentId && r.studentId.email && r.studentId.email.toLowerCase().includes(term)) ||
          (r.eventId && r.eventId.title && r.eventId.title.toLowerCase().includes(term))
      );
    }

    const totalCount = registrations.length;
    const paginated = registrations.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      count: paginated.length,
      totalRegistrations: totalCount,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      currentPage: pageNum,
      registrations: paginated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getStudents,
  getAllRegistrations,
};
