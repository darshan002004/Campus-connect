const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Technical',
          'Cultural',
          'Sports',
          'Workshop',
          'Seminar',
          'Hackathon',
          'Management',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    eventDate: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    eventTime: {
      type: String,
      required: [true, 'Please provide event timing (e.g., 10:00 AM - 04:00 PM)'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Please specify the event venue'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Please specify the organizing department or club'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for remaining seats
eventSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});

// Indexes for high-performance searching and filtering
eventSchema.index({ title: 'text', description: 'text', organizer: 'text', venue: 'text' });
eventSchema.index({ category: 1, eventDate: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);
