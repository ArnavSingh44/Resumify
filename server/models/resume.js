const pool = require('../db');

class Resume {
  static async create(userId, data = {}) {
    const result = await pool.query(
      'INSERT INTO resumes (user_id, data) VALUES ($1, $2) RETURNING *',
      [userId, JSON.stringify(data)]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT id, data, is_public, public_id, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async findByPublicId(publicId) {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE public_id = $1 AND is_public = TRUE',
      [publicId]
    );
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const result = await pool.query(
      'UPDATE resumes SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [JSON.stringify(data), id, userId]
    );
    return result.rows[0];
  }

  static async updateVisibility(id, userId, isPublic, publicId = null) {
      const result = await pool.query(
          'UPDATE resumes SET is_public = $1, public_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
          [isPublic, publicId, id, userId]
      );
      return result.rows[0];
  }

  static async delete(id, userId) {
    await pool.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
  }
}

module.exports = Resume;
