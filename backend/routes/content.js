const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/content/:page — public, no auth required
router.get('/:page', (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT section, content_en, content_vi FROM site_content WHERE page = ?'
    ).all(req.params.page);
    const map = {};
    for (const row of rows) {
      map[row.section] = { content_en: row.content_en, content_vi: row.content_vi };
    }
    res.json(map);
  } catch {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

module.exports = router;
