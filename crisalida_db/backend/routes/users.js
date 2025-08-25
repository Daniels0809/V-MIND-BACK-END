const express = require('express');
const router = express.Router();
const {
  getUserInterests,
  updateUserInterest,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  getUserResources,
  saveResource,
  getUserStats
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Interests
router.get('/interests', getUserInterests);
router.put('/interests', updateUserInterest);

// Notes
router.get('/notes', getUserNotes);
router.post('/notes', createNote);
router.put('/notes/:noteId', updateNote);
router.delete('/notes/:noteId', deleteNote);

// Resources
router.get('/resources', getUserResources);
router.post('/resources', saveResource);

// Stats
router.get('/stats', getUserStats);

module.exports = router;
