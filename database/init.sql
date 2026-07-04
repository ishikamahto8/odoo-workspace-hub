-- Database configuration and raw initialization script

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('Employee', 'HR');
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Half-day', 'Leave');
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE leave_type AS ENUM ('Paid', 'Sick', 'Unpaid');

-- Create Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'Employee',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    profile_picture_url TEXT,
    job_details JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status attendance_status DEFAULT 'Present',
    CONSTRAINT unique_user_date UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remarks TEXT,
    status leave_status DEFAULT 'Pending',
    admin_comments TEXT,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payroll (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    base_salary NUMERIC(10, 2) DEFAULT 0.00,
    allowances NUMERIC(10, 2) DEFAULT 0.00,
    deductions NUMERIC(10, 2) DEFAULT 0.00,
    salary_structure JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Explicit B-Tree Indexes
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_user ON leave_requests(user_id);
