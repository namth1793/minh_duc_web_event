const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAdmin, JWT_SECRET } = require('../middleware/auth');

// ─── MULTER SETUP ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  },
});

// POST /api/admin/upload — upload image file, returns { url }
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Không có file được tải lên' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, username: admin.username });
});

// ─── BLOG CRUD ────────────────────────────────────────────────────────────────

// GET /api/admin/blog
router.get('/blog', requireAdmin, (req, res) => {
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  res.json(posts);
});

// POST /api/admin/blog
router.post('/blog', requireAdmin, (req, res) => {
  const {
    title_en, title_vi, category, date, thumbnail,
    excerpt_en, excerpt_vi, content_en, content_vi
  } = req.body;

  if (!title_en || !title_vi || !category || !date || !thumbnail ||
      !excerpt_en || !excerpt_vi || !content_en || !content_vi) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const result = db.prepare(`
    INSERT INTO blog_posts (title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi, content_en, content_vi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi, content_en, content_vi);

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

// PUT /api/admin/blog/:id
router.put('/blog/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    title_en, title_vi, category, date, thumbnail,
    excerpt_en, excerpt_vi, content_en, content_vi
  } = req.body;

  const existing = db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  db.prepare(`
    UPDATE blog_posts SET
      title_en = ?, title_vi = ?, category = ?, date = ?, thumbnail = ?,
      excerpt_en = ?, excerpt_vi = ?, content_en = ?, content_vi = ?
    WHERE id = ?
  `).run(title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi, content_en, content_vi, id);

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
  res.json(post);
});

// DELETE /api/admin/blog/:id
router.delete('/blog/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  res.json({ success: true });
});

// ─── CAREERS CRUD ─────────────────────────────────────────────────────────────

// GET /api/admin/careers
router.get('/careers', requireAdmin, (req, res) => {
  const jobs = db.prepare('SELECT * FROM careers ORDER BY created_at DESC').all();
  res.json(jobs);
});

// POST /api/admin/careers
router.post('/careers', requireAdmin, (req, res) => {
  const { title_en, title_vi, department_en, department_vi, description_en, description_vi, type } = req.body;

  if (!title_en || !title_vi || !department_en || !department_vi || !description_en || !description_vi || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const result = db.prepare(`
    INSERT INTO careers (title_en, title_vi, department_en, department_vi, description_en, description_vi, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title_en, title_vi, department_en, department_vi, description_en, description_vi, type);

  const job = db.prepare('SELECT * FROM careers WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(job);
});

// PUT /api/admin/careers/:id
router.put('/careers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title_en, title_vi, department_en, department_vi, description_en, description_vi, type } = req.body;

  const existing = db.prepare('SELECT id FROM careers WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Job not found' });

  db.prepare(`
    UPDATE careers SET
      title_en = ?, title_vi = ?, department_en = ?, department_vi = ?,
      description_en = ?, description_vi = ?, type = ?
    WHERE id = ?
  `).run(title_en, title_vi, department_en, department_vi, description_en, description_vi, type, id);

  const job = db.prepare('SELECT * FROM careers WHERE id = ?').get(id);
  res.json(job);
});

// DELETE /api/admin/careers/:id
router.delete('/careers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM careers WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Job not found' });

  db.prepare('DELETE FROM careers WHERE id = ?').run(id);
  res.json({ success: true });
});

// ─── SITE CONTENT ─────────────────────────────────────────────────────────────

// GET /api/admin/content
router.get('/content', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM site_content ORDER BY page, section').all();

  // Group by page
  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.page]) grouped[row.page] = [];
    grouped[row.page].push(row);
  }
  res.json(grouped);
});

// GET /api/admin/content/:page
router.get('/content/:page', requireAdmin, (req, res) => {
  const { page } = req.params;
  const rows = db.prepare('SELECT * FROM site_content WHERE page = ? ORDER BY section').all(page);
  res.json(rows);
});

// PUT /api/admin/content/:page/:section
router.put('/content/:page/:section', requireAdmin, (req, res) => {
  const { page, section } = req.params;
  const { content_en, content_vi } = req.body;

  db.prepare(`
    INSERT INTO site_content (page, section, content_en, content_vi, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(page, section) DO UPDATE SET
      content_en = excluded.content_en,
      content_vi = excluded.content_vi,
      updated_at = CURRENT_TIMESTAMP
  `).run(page, section, content_en || null, content_vi || null);

  const row = db.prepare('SELECT * FROM site_content WHERE page = ? AND section = ?').get(page, section);
  res.json(row);
});

// ─── SITE IMAGES ──────────────────────────────────────────────────────────────

// GET /api/admin/images
router.get('/images', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM site_images ORDER BY page, section, sort_order').all();

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.page]) grouped[row.page] = [];
    grouped[row.page].push(row);
  }
  res.json(grouped);
});

// GET /api/admin/images/:page
router.get('/images/:page', requireAdmin, (req, res) => {
  const { page } = req.params;
  const rows = db.prepare('SELECT * FROM site_images WHERE page = ? ORDER BY section, sort_order').all(page);
  res.json(rows);
});

// POST /api/admin/images
router.post('/images', requireAdmin, (req, res) => {
  const { page, section, label, url, sort_order } = req.body;

  if (!page || !section || !url) {
    return res.status(400).json({ error: 'page, section, and url are required' });
  }

  const result = db.prepare(`
    INSERT INTO site_images (page, section, label, url, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(page, section, label || null, url, sort_order || 0);

  const image = db.prepare('SELECT * FROM site_images WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(image);
});

// PUT /api/admin/images/:id
router.put('/images/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { page, section, label, url, sort_order } = req.body;

  const existing = db.prepare('SELECT id FROM site_images WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Image not found' });

  db.prepare(`
    UPDATE site_images SET page = ?, section = ?, label = ?, url = ?, sort_order = ?
    WHERE id = ?
  `).run(page, section, label || null, url, sort_order || 0, id);

  const image = db.prepare('SELECT * FROM site_images WHERE id = ?').get(id);
  res.json(image);
});

// DELETE /api/admin/images/:id
router.delete('/images/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM site_images WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Image not found' });

  // Delete physical file if it's a local upload
  if (existing.url && existing.url.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', existing.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM site_images WHERE id = ?').run(id);
  res.json({ success: true });
});

// ─── SUBMISSIONS (READ-ONLY) ──────────────────────────────────────────────────

// GET /api/admin/contacts
router.get('/contacts', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/admin/inquiries
router.get('/inquiries', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM event_inquiries ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/admin/applications
router.get('/applications', requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT ca.*, c.title_en as job_title_en
    FROM career_applications ca
    LEFT JOIN careers c ON ca.job_id = c.id
    ORDER BY ca.created_at DESC
  `).all();
  res.json(rows);
});

module.exports = router;
