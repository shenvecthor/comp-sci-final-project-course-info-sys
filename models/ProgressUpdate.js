const mongoose = require('mongoose');

const ProgressUpdateSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  gradingStatus: { type: String, required: true },
  gradingCompletionDate: Date,
  marksheetStatus: { type: String, required: true },
  marksheetCompletionDate: Date,
  marksheetSubmitted: { type: Boolean, default: false },
  marksheetSubmissionDate: Date
});

module.exports = mongoose.model('ProgressUpdate', ProgressUpdateSchema);