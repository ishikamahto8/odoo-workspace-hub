const pool = require('../config/db');

const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, start_date, end_date, remarks } = req.body;
    
    if (!type || !start_date || !end_date) {
      return res.status(400).json({ error: 'Type, start date, and end date are required' });
    }
    
    const insertQuery = `
      INSERT INTO leave_requests (user_id, type, start_date, end_date, remarks, status)
      VALUES ($1, $2, $3, $4, $5, 'Pending')
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [userId, type, start_date, end_date, remarks]);
    
    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest: result.rows[0]
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    
    res.status(200).json({
      leaveRequests: result.rows
    });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const reviewLeave = async (req, res) => {
  const client = await pool.connect();
  try {
    const adminId = req.user.id;
    const leaveId = req.params.id;
    const { status, admin_comments } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either Approved or Rejected' });
    }
    
    await client.query('BEGIN');
    
    const updateQuery = `
      UPDATE leave_requests
      SET status = $1, admin_comments = $2, approved_by = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, [status, admin_comments, adminId, leaveId]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leaveRequest: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Review leave error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leave_requests WHERE status = $1 ORDER BY created_at DESC', ['Pending']);
    res.status(200).json({ leaveRequests: result.rows });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  reviewLeave,
  getAllLeaves
};
