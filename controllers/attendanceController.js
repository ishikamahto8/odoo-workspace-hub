const pool = require('../config/db');

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    const checkInTime = new Date();
    
    const insertQuery = `
      INSERT INTO attendance (user_id, date, check_in, status)
      VALUES ($1, $2, $3, 'Present')
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [userId, currentDate, checkInTime]);
    
    res.status(201).json({
      message: 'Checked in successfully',
      attendance: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(400).json({ error: 'Already checked in for today' });
    }
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date();
    
    const updateQuery = `
      UPDATE attendance
      SET check_out = $1
      WHERE user_id = $2 AND date = $3 AND check_out IS NULL
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [checkOutTime, userId, currentDate]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'No active check-in found for today, or already checked out' });
    }
    
    res.status(200).json({
      message: 'Checked out successfully',
      attendance: result.rows[0]
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC', [userId]);
    
    res.status(200).json({
      attendance: result.rows
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const query = `
      SELECT a.*, u.employee_id, p.first_name, p.last_name
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY a.date DESC, a.check_in DESC
    `;
    const result = await pool.query(query);
    
    res.status(200).json({
      attendance: result.rows
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
};
