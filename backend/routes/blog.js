const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/blog - list all blog posts
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT id, title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi
      FROM blog_posts
      ORDER BY date DESC
    `).all();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blog/:id - single blog post
router.get('/:id', (req, res) => {
  try {
    const post = db.prepare(`
      SELECT id, title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi, content_en, content_vi
      FROM blog_posts
      WHERE id = ?
    `).get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

module.exports = router;
