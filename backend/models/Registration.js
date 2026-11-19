const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered',
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to strictly prevent duplicate registrations at the database level
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

// Secondary indexes for queries
registrationSchema.index({ studentId: 1, status: 1 });
registrationSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
