const { pool } = require('../config/database');

const getUserInterests = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT i.interest_id, i.name, il.knowledge_level
      FROM interests i
      LEFT JOIN interest_levels il ON i.interest_id = il.interest_id AND il.user_id = ?
      ORDER BY i.name
    `;

    const [rows] = await pool.execute(query, [userId]);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Get user interests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user interests',
      error: error.message
    });
  }
};

const updateUserInterest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { interestId, knowledgeLevel } = req.body;

    if (!interestId || !knowledgeLevel) {
      return res.status(400).json({
        success: false,
        message: 'Interest ID and knowledge level are required'
      });
    }

    const validLevels = ['novato', 'principiante', 'intermedio', 'avanzado', 'experto'];
    if (!validLevels.includes(knowledgeLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid knowledge level'
      });
    }

    const query = `
      INSERT INTO interest_levels (user_id, interest_id, knowledge_level)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE knowledge_level = VALUES(knowledge_level)
    `;

    await pool.execute(query, [userId, interestId, knowledgeLevel]);

    res.json({
      success: true,
      message: 'Interest updated successfully'
    });

  } catch (error) {
    console.error('Update user interest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user interest',
      error: error.message
    });
  }
};

const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT note_id, title, content, created_at, updated_at
      FROM notes
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user notes',
      error: error.message
    });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const query = `
      INSERT INTO notes (user_id, title, content)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute(query, [userId, title, content]);

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note_id: result.insertId }
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { noteId } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: 'At least title or content must be provided'
      });
    }

    const updateFields = [];
    const values = [];

    if (title) {
      updateFields.push('title = ?');
      values.push(title);
    }
    if (content) {
      updateFields.push('content = ?');
      values.push(content);
    }

    values.push(userId, noteId);

    const query = `
      UPDATE notes 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE user_id = ? AND note_id = ?
    `;

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully'
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { noteId } = req.params;

    const query = 'DELETE FROM notes WHERE user_id = ? AND note_id = ?';
    const [result] = await pool.execute(query, [userId, noteId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
};

const getUserResources = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT resource_id, title, type, link, duration_minutes, date_saved
      FROM resources
      WHERE user_id = ?
      ORDER BY date_saved DESC
    `;

    const [rows] = await pool.execute(query, [userId]);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Get user resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user resources',
      error: error.message
    });
  }
};

const saveResource = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, type, link, duration_minutes } = req.body;

    if (!title || !type || !link) {
      return res.status(400).json({
        success: false,
        message: 'Title, type and link are required'
      });
    }

    const validTypes = ['video', 'pdf', 'web', 'otro'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type'
      });
    }

    const query = `
      INSERT INTO resources (user_id, title, type, link, duration_minutes)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [userId, title, type, link, duration_minutes]);

    res.status(201).json({
      success: true,
      message: 'Resource saved successfully',
      data: { resource_id: result.insertId }
    });

  } catch (error) {
    console.error('Save resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving resource',
      error: error.message
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Get user basic info
    const userQuery = 'SELECT current_level, creation_date, last_connection FROM users WHERE user_id = ?';
    const [userRows] = await pool.execute(userQuery, [userId]);
    const user = userRows[0];

    // Get task progress
    const taskQuery = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN ut.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN ut.status = 'completed' THEN t.xp_reward ELSE 0 END) as total_xp
      FROM user_tasks ut
      JOIN tasks t ON ut.task_id = t.task_id
      WHERE ut.user_id = ?
    `;
    const [taskRows] = await pool.execute(taskQuery, [userId]);
    const taskStats = taskRows[0];

    // Get streak info
    const streakQuery = 'SELECT current_streak_days, longest_streak_days FROM streaks WHERE user_id = ?';
    const [streakRows] = await pool.execute(streakQuery, [userId]);
    const streak = streakRows[0] || { current_streak_days: 0, longest_streak_days: 0 };

    // Get triumphs count
    const triumphQuery = 'SELECT COUNT(*) as triumphs_count FROM user_triumphs WHERE user_id = ?';
    const [triumphRows] = await pool.execute(triumphQuery, [userId]);
    const triumphs = triumphRows[0];

    // Get notes and resources count
    const notesQuery = 'SELECT COUNT(*) as notes_count FROM notes WHERE user_id = ?';
    const [notesRows] = await pool.execute(notesQuery, [userId]);
    const notes = notesRows[0];

    const resourcesQuery = 'SELECT COUNT(*) as resources_count FROM resources WHERE user_id = ?';
    const [resourcesRows] = await pool.execute(resourcesQuery, [userId]);
    const resources = resourcesRows[0];

    res.json({
      success: true,
      data: {
        user: {
          current_level: user.current_level,
          creation_date: user.creation_date,
          last_connection: user.last_connection
        },
        tasks: {
          total: parseInt(taskStats.total_tasks),
          completed: parseInt(taskStats.completed_tasks),
          total_xp: parseInt(taskStats.total_xp),
          completion_percentage: taskStats.total_tasks > 0 
            ? Math.round((taskStats.completed_tasks / taskStats.total_tasks) * 100) 
            : 0
        },
        streak: {
          current: parseInt(streak.current_streak_days),
          longest: parseInt(streak.longest_streak_days)
        },
        achievements: {
          triumphs: parseInt(triumphs.triumphs_count),
          notes: parseInt(notes.notes_count),
          resources: parseInt(resources.resources_count)
        }
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user stats',
      error: error.message
    });
  }
};

module.exports = {
  getUserInterests,
  updateUserInterest,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  getUserResources,
  saveResource,
  getUserStats
};
