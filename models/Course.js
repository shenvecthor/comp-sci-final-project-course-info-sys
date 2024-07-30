const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  startDate: { type: Date, required: true },
  assignments: [{
    title: String,
    issueDate: Date,
    dueDate: Date,
    isMarked: { type: Boolean, default: false }
  }],
  tests: [{
    title: String,
    date: Date,
    isMarked: { type: Boolean, default: false }
  }],
  finalExam: {
    date: Date,
    isMarked: { type: Boolean, default: false }
  },
  finalProject: {
    dueDate: Date,
    isMarked: { type: Boolean, default: false }
  },
  marksheetStatus: {
    isCompleted: { type: Boolean, default: false },
    submissionDate: Date
  }
});

module.exports = mongoose.model('Course', CourseSchema);