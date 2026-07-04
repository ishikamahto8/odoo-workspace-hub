const pool = require('../config/db');

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    const payrollResult = await pool.query('SELECT * FROM payroll WHERE user_id = $1', [userId]);
    
    res.status(200).json({
      profile: profileResult.rows[0] || null,
      payroll: payrollResult.rows[0] || null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, address, profile_picture_url } = req.body;
    
    const updateQuery = `
      UPDATE profiles
      SET phone = COALESCE($1, phone),
          address = COALESCE($2, address),
          profile_picture_url = COALESCE($3, profile_picture_url)
      WHERE user_id = $4
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [phone, address, profile_picture_url, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.status(200).json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.employee_id, u.email, u.role, p.first_name, p.last_name, p.phone, p.address, p.job_details
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `;
    const result = await pool.query(query);
    
    res.status(200).json({
      profiles: result.rows
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProfileByAdmin = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { first_name, last_name, phone, address, profile_picture_url, job_details } = req.body;
    
    const updateQuery = `
      UPDATE profiles
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone = COALESCE($3, phone),
          address = COALESCE($4, address),
          profile_picture_url = COALESCE($5, profile_picture_url),
          job_details = COALESCE($6, job_details)
      WHERE user_id = $7
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      first_name, last_name, phone, address, profile_picture_url, job_details, targetUserId
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.status(200).json({
      message: 'Profile updated successfully by admin',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Admin update profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getMe,
  updateMe,
  getAllProfiles,
  updateProfileByAdmin
};
