const express = require('express');
const router = express.Router();
const Lecturer = require('../models/Lecturer');

//Get all lecturers for dropdown
router.get('/list', async (req, res) => {
  try {
    const lecturers = await Lecturer.find({}, 'name _id');
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all lecturers
router.get('/', async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single lecturer
router.get('/:id', async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });
    res.json(lecturer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new lecturer
router.post('/', async (req, res) => {
  const lecturer = new Lecturer(req.body);
  try {
    const newLecturer = await lecturer.save();
    res.status(201).json(newLecturer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a lecturer
router.patch('/:id', async (req, res) => {
  try {
    const updatedLecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLecturer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a lecturer
router.delete('/:id', async (req, res) => {
  try {
    await Lecturer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lecturer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;