// main.js - CWE89 SQL Injection vulnerability
const { Sequelize } = require('sequelize');
const express = require('express');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

/**
 * Retrieves a user's profile information from the users table
 * @param {string} username - The username to look up
 * @returns {Object|null} User profile data or null if not found
 */
async function getUserProfile(username) {
    // VULNERABLE: SQL Injection in string interpolation (CWE89-01)
    const [results] = await sequelize.query(
      `SELECT id, username, email, created_at FROM users WHERE username = '${username}'`
    );

    return results.length ? results[0] : null;
}

// Create Express application and routes
const app = express();

app.get('/api/user/:username', async (req, res) => {
    try {
      const profile = await getUserProfile(req.params.username);
      res.json(profile || { error: 'User not found' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
});

// Run server
if (require.main === module) {
    const PORT = process.env.PORT;
    app.listen(PORT);
  }

module.exports = { getUserProfile, app };
