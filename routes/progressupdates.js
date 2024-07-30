const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProgressUpdate = require('../models/ProgressUpdate');

// Get all progress updates
router.get('/', async (req, res) => {
  try {
    const updates = await ProgressUpdate.find().populate('course').populate('lecturer');
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single progress update
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
    const update = await ProgressUpdate.findById(req.params.id).populate('course').populate('lecturer');
    if (!update) return res.status(404).json({ message: 'Progress update not found' });
    res.json(update);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new progress update
router.post('/', async (req, res) => {
  const update = new ProgressUpdate({
    course: req.body.course,
    lecturer: req.body.lecturer,
    gradingStatus: req.body.gradingStatus,
    gradingCompletionDate: req.body.gradingCompletionDate,
    marksheetStatus: req.body.marksheetStatus,
    marksheetCompletionDate: req.body.marksheetCompletionDate,
    marksheetSubmitted: req.body.marksheetSubmitted,
    marksheetSubmissionDate: req.body.marksheetSubmissionDate
  });

  try {
    const newUpdate = await update.save();
    const populatedUpdate = await ProgressUpdate.findById(newUpdate._id).populate('course').populate('lecturer');
    res.status(201).json(populatedUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a progress update
router.patch('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
    const allowedUpdates = ['course', 'lecturer', 'gradingStatus', 'gradingCompletionDate', 'marksheetStatus', 'marksheetCompletionDate', 'marksheetSubmitted', 'marksheetSubmissionDate'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedUpdate = await ProgressUpdate.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('course').populate('lecturer');

    if (!updatedUpdate) {
      return res.status(404).json({ message: 'Progress update not found' });
    }
    res.json(updatedUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a progress update
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
    const deletedUpdate = await ProgressUpdate.findByIdAndDelete(req.params.id);
    if (!deletedUpdate) {
      return res.status(404).json({ message: 'Progress update not found' });
    }
    res.json({ message: 'Progress update deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;