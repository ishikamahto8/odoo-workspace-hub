const pool = require('../config/db');

const getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM payroll WHERE user_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payroll information not found' });
    }
    
    res.status(200).json({
      payroll: result.rows[0]
    });
  } catch (error) {
    console.error('Get my payroll error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePayrollStructure = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { base_salary, allowances, deductions, salary_structure } = req.body;
    
    // Check if payroll exists
    const checkResult = await pool.query('SELECT id FROM payroll WHERE user_id = $1', [targetUserId]);
    
    let result;
    if (checkResult.rows.length > 0) {
      // Update existing record
      const updateQuery = `
        UPDATE payroll
        SET base_salary = COALESCE($1, base_salary),
            allowances = COALESCE($2, allowances),
            deductions = COALESCE($3, deductions),
            salary_structure = COALESCE($4, salary_structure)
        WHERE user_id = $5
        RETURNING *
      `;
      result = await pool.query(updateQuery, [base_salary, allowances, deductions, salary_structure, targetUserId]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO payroll (user_id, base_salary, allowances, deductions, salary_structure)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      result = await pool.query(insertQuery, [targetUserId, base_salary || 0, allowances || 0, deductions || 0, salary_structure || '{}']);
    }
    
    res.status(200).json({
      message: 'Payroll structure updated successfully',
      payroll: result.rows[0]
    });
  } catch (error) {
    console.error('Update payroll structure error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getMyPayroll,
  updatePayrollStructure
};
