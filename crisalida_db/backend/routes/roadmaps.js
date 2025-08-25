const express = require('express');
const router = express.Router();
const {
  createRoadmap,
  getAllRoadmaps,
  getRoadmapById,
  getUserRoadmaps,
  updateRoadmap,
  deleteRoadmap
} = require('../controllers/roadmapController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', getAllRoadmaps);
router.get('/:roadmapId', getRoadmapById);

// Protected routes
router.post('/', auth, createRoadmap);
router.get('/user/my-roadmaps', auth, getUserRoadmaps);
router.put('/:roadmapId', auth, updateRoadmap);
router.delete('/:roadmapId', auth, deleteRoadmap);

module.exports = router;
