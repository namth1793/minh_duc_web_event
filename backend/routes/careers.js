const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/careers - list all jobs
router.get('/', (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT id, title_en, title_vi, department_en, department_vi, description_en, description_vi, type
      FROM careers
      ORDER BY id ASC
    `).all();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

module.exports = router;
