const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  academicYear: { type: String, required: true }
});

module.exports = mongoose.model('Semester', SemesterSchema);