const Roadmap = require('../models/Roadmap');

const createRoadmap = async (req, res) => {
  try {
    const { title, roadmap_description, topic, difficulty, estimated_time } = req.body;
    const userId = req.user.user_id;

    // Validate required fields
    if (!title || !roadmap_description || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, topic and difficulty are required'
      });
    }

    // Validate difficulty enum
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty must be beginner, intermediate, or advanced'
      });
    }

    const roadmapData = {
      title,
      roadmap_description,
      topic,
      difficulty,
      estimated_time: estimated_time || 0,
      user_id: userId
    };

    const newRoadmap = await Roadmap.create(roadmapData);

    res.status(201).json({
      success: true,
      message: 'Roadmap created successfully',
      data: newRoadmap
    });

  } catch (error) {
    console.error('Create roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating roadmap',
      error: error.message
    });
  }
};

const getAllRoadmaps = async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    let roadmaps;

    if (difficulty) {
      roadmaps = await Roadmap.getRoadmapsByDifficulty(difficulty);
    } else {
      roadmaps = await Roadmap.getAllRoadmaps();
    }

    // Filter by topic if provided
    if (topic) {
      roadmaps = roadmaps.filter(roadmap => 
        roadmap.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: roadmaps
    });

  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting roadmaps',
      error: error.message
    });
  }
};

const getRoadmapById = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.json({
      success: true,
      data: roadmap
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting roadmap',
      error: error.message
    });
  }
};

const getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roadmaps = await Roadmap.getRoadmapsByUser(userId);

    res.json({
      success: true,
      data: roadmaps
    });

  } catch (error) {
    console.error('Get user roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user roadmaps',
      error: error.message
    });
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { title, roadmap_description, topic, difficulty, estimated_time } = req.body;

    // Check if roadmap exists and belongs to user
    const existingRoadmap = await Roadmap.findById(roadmapId);
    if (!existingRoadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    if (existingRoadmap.user_id !== req.user.user_id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own roadmaps'
      });
    }

    const updateData = {
      title: title || existingRoadmap.title,
      roadmap_description: roadmap_description || existingRoadmap.roadmap_description,
      topic: topic || existingRoadmap.topic,
      difficulty: difficulty || existingRoadmap.difficulty,
      estimated_time: estimated_time || existingRoadmap.estimated_time
    };

    const success = await Roadmap.update(roadmapId, updateData);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error updating roadmap'
      });
    }

    res.json({
      success: true,
      message: 'Roadmap updated successfully',
      data: updateData
    });

  } catch (error) {
    console.error('Update roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating roadmap',
      error: error.message
    });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    // Check if roadmap exists and belongs to user
    const existingRoadmap = await Roadmap.findById(roadmapId);
    if (!existingRoadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    if (existingRoadmap.user_id !== req.user.user_id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own roadmaps'
      });
    }

    const success = await Roadmap.delete(roadmapId);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting roadmap'
      });
    }

    res.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });

  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting roadmap',
      error: error.message
    });
  }
};

module.exports = {
  createRoadmap,
  getAllRoadmaps,
  getRoadmapById,
  getUserRoadmaps,
  updateRoadmap,
  deleteRoadmap
};
