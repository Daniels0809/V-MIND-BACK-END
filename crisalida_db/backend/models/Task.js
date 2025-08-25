const { pool } = require('../config/database');

class Task {
  static async create(taskData) {
    const query = `
      INSERT INTO tasks (level_id, title, description, type, xp_reward, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      taskData.level_id,
      taskData.title,
      taskData.description,
      taskData.type,
      taskData.xp_reward || 0,
      taskData.status || 'pending'
    ];

    try {
      const [result] = await pool.execute(query, values);
      return { task_id: result.insertId, ...taskData };
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  static async findById(taskId) {
    const query = `
      SELECT t.*, l.title as level_title, l.roadmap_id
      FROM tasks t
      LEFT JOIN levels l ON t.level_id = l.level_id
      WHERE t.task_id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [taskId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding task: ${error.message}`);
    }
  }

  static async getTasksByLevel(levelId) {
    const query = `
      SELECT t.*, l.title as level_title
      FROM tasks t
      LEFT JOIN levels l ON t.level_id = l.level_id
      WHERE t.level_id = ?
      ORDER BY t.task_id
    `;
    
    try {
      const [rows] = await pool.execute(query, [levelId]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting tasks by level: ${error.message}`);
    }
  }

  static async getTasksByType(type) {
    const query = `
      SELECT t.*, l.title as level_title
      FROM tasks t
      LEFT JOIN levels l ON t.level_id = l.level_id
      WHERE t.type = ?
      ORDER BY t.task_id
    `;
    
    try {
      const [rows] = await pool.execute(query, [type]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting tasks by type: ${error.message}`);
    }
  }

  static async updateStatus(taskId, status) {
    const query = 'UPDATE tasks SET status = ? WHERE task_id = ?';
    
    try {
      const [result] = await pool.execute(query, [status, taskId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating task status: ${error.message}`);
    }
  }

  static async delete(taskId) {
    const query = 'DELETE FROM tasks WHERE task_id = ?';
    
    try {
      const [result] = await pool.execute(query, [taskId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }

  static async getUserTasks(userId) {
    const query = `
      SELECT ut.*, t.title, t.description, t.type, t.xp_reward, l.title as level_title
      FROM user_tasks ut
      LEFT JOIN tasks t ON ut.task_id = t.task_id
      LEFT JOIN levels l ON t.level_id = l.level_id
      WHERE ut.user_id = ?
      ORDER BY ut.date_completed DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting user tasks: ${error.message}`);
    }
  }

  static async completeUserTask(userTaskId, userId) {
    const query = `
      UPDATE user_tasks 
      SET status = 'completed', date_completed = NOW()
      WHERE user_task_id = ? AND user_id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [userTaskId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error completing user task: ${error.message}`);
    }
  }
}

module.exports = Task;
