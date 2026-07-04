# odoo-workspace-hub
# SkyHigh HRMS

> Secure, local-first people operations for employee self-service, real-time attendance, leave pipelines, and payroll audits.

---

## Description/Overview

**SkyHigh HRMS** is a lightweight, self-hosted Human Resource Management System designed to handle standard workforce operations locally. Built with security and performance in mind, this application operates entirely on local hardware with zero external third-party cloud dependencies. It provides distinct, role-aware interfaces for both regular employees and HR managers to streamline clock-ins, personal profiles, leave workflows, and salary structures.

---

## Features

*   **Role-Aware Dashboards:** Displays tailored, context-specific workspaces based on user roles (HR/Admin vs. Standard Employee).
*   **Secure Authentication:** Utilizes local salted password hashing (Bcrypt) and secure session management via JSON Web Tokens (JWT).
*   **Check-in Console:** Real-time clock system with persistence state handling, allowing employees to log daily check-ins and check-outs securely.
*   **Leave Management Pipeline:** Structured request system for employees to apply for time off, alongside an administrative approval/rejection queue for HR managers.
*   **Payroll & Salary Configuration:** Interactive compensation ledger for HR to update basic pay, allowance, and deductions, paired with read-only self-service access for employees.
*   **Local File Uploads:** Supports uploading employee avatars securely to a local server folder instead of third-party cloud engines.

---

## Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla Asynchronous JavaScript (Fetch API)
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (Relational DB)
*   **Key Libraries:** 
    *   `pg` (PostgreSQL Client)
    *   `bcryptjs` (Credential Hashing)
    *   `jsonwebtoken` (Session Security)
    *   `multer` (Local Multipart File Parsing)
    *   `cors` & `dotenv` (Security and Configuration)

---

## Prerequisites

Before setting up the project, make sure the following programs are installed on your computer:

1.  **Node.js (LTS Version):** [Download from Node.js Official Site](https://nodejs.org/)
2.  **PostgreSQL Database:** [Download from PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
3.  **Code Editor (Optional but recommended):** [VS Code](https://code.visualstudio.com/)

