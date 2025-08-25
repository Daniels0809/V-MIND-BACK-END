const { pool } = require('../config/database');

class Roadmap {
  static async create(roadmapData) {
    const query = `
      INSERT INTO roadmaps (title, roadmap_description, topic, difficulty, estimated_time, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      roadmapData.title,
      roadmapData.roadmap_description,
      roadmapData.topic,
      roadmapData.difficulty,
      roadmapData.estimated_time,
      roadmapData.user_id
    ];

    try {
      const [result] = await pool.execute(query, values);
      return { roadmap_id: result.insertId, ...roadmapData };
    } catch (error) {
      throw new Error(`Error creating roadmap: ${error.message}`);
    }
  }

  static async findById(roadmapId) {
    const query = `
      SELECT r.*, u.user_name as creator_name
      FROM roadmaps r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.roadmap_id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [roadmapId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding roadmap: ${error.message}`);
    }
  }

  static async getAllRoadmaps() {
    const query = `
      SELECT r.*, u.user_name as creator_name
      FROM roadmaps r
      LEFT JOIN users u ON r.user_id = u.user_id
      ORDER BY r.creation_date DESC
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting all roadmaps: ${error.message}`);
    }
  }

  static async getRoadmapsByUser(userId) {
    const query = `
      SELECT r.*, u.user_name as creator_name
      FROM roadmaps r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.user_id = ?
      ORDER BY r.creation_date DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting user roadmaps: ${error.message}`);
    }
  }

  static async getRoadmapsByDifficulty(difficulty) {
    const query = `
      SELECT r.*, u.user_name as creator_name
      FROM roadmaps r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.difficulty = ?
      ORDER BY r.creation_date DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [difficulty]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting roadmaps by difficulty: ${error.message}`);
    }
  }

  static async update(roadmapId, updateData) {
    const query = `
      UPDATE roadmaps 
      SET title = ?, roadmap_description = ?, topic = ?, difficulty = ?, estimated_time = ?
      WHERE roadmap_id = ?
    `;
    
    const values = [
      updateData.title,
      updateData.roadmap_description,
      updateData.topic,
      updateData.difficulty,
      updateData.estimated_time,
      roadmapId
    ];

    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating roadmap: ${error.message}`);
    }
  }

  static async delete(roadmapId) {
    const query = 'DELETE FROM roadmaps WHERE roadmap_id = ?';
    
    try {
      const [result] = await pool.execute(query, [roadmapId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting roadmap: ${error.message}`);
    }
  }
}

module.exports = Roadmap;
