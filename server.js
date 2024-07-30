const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Import routes
const coursesRoutes = require('./routes/courses');
const lecturersRoutes = require('./routes/lecturers');
const semestersRoutes = require('./routes/semesters');
const progressUpdatesRoutes = require('./routes/progressupdates');


// Use routes
app.use('/api/courses', coursesRoutes);
app.use('/api/lecturers', lecturersRoutes);
app.use('/api/semesters', semestersRoutes);
app.use('/api/progress-updates', progressUpdatesRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));