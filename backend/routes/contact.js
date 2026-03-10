const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contact
router.post('/contact', (req, res) => {
  try {
    const { name, email, phone, message, event_date, attendees } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, phone, message, event_date, attendees)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, phone || null, message, event_date || null, attendees || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid, message: 'Your message has been received. We will be in touch shortly.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// POST /api/event-inquiry
router.post('/event-inquiry', (req, res) => {
  try {
    const { name, email, phone, event_date, guests, info, newsletter } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO event_inquiries (name, email, phone, event_date, guests, info, newsletter)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      name, email, phone || null, event_date || null,
      guests || null, info || null, newsletter ? 1 : 0
    );
    res.status(201).json({ success: true, id: result.lastInsertRowid, message: 'Your inquiry has been received. Our team will contact you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// POST /api/career-apply
router.post('/career-apply', (req, res) => {
  try {
    const { name, email, phone, job_id, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO career_applications (name, email, phone, job_id, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, phone || null, job_id || null, message || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid, message: 'Your application has been received. We will review it and get back to you.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save application' });
  }
});

module.exports = router;
