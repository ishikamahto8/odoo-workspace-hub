const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signUp = async (req, res) => {
  const client = await pool.connect();
  try {
    const { employeeId, email, password, role } = req.body;

    if (!employeeId || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query('SELECT id FROM users WHERE email = $1 OR employee_id = $2', [email, employeeId]);
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'User with this email or employee ID already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const insertUserQuery = `
      INSERT INTO users (employee_id, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, employee_id, email, role, is_verified
    `;
    const userResult = await client.query(insertUserQuery, [employeeId, email, passwordHash, role]);
    const user = userResult.rows[0];

    // Create empty profile
    const insertProfileQuery = `
      INSERT INTO profiles (user_id)
      VALUES ($1)
    `;
    await client.query(insertProfileQuery, [user.id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
    const profile = profileResult.rows[0];

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        profile
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn
};
