const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');

// Get all semesters
router.get('/', async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single semester
router.get('/:id', async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new semester
router.post('/', async (req, res) => {
  const semester = new Semester(req.body);
  try {
    const newSemester = await semester.save();
    res.status(201).json(newSemester);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a semester
router.patch('/:id', async (req, res) => {
  try {
    const updatedSemester = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSemester);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a semester
router.delete('/:id', async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);
    res.json({ message: 'Semester deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;