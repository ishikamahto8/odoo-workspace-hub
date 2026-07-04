const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api', apiRoutes);

// 404 fallback handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - ensures server never crashes on unhandled errors
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
