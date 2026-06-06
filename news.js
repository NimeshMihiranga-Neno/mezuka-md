// =============================================
// NEWS SYSTEM - news.js
// MongoDB MEZUKADB > 'news' collection
// Admin: username=admin, password=Nimesh@123
// =============================================

const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://example';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Nimesh@123';

let newsClient = null;
let newsCol = null;

async function initNewsDB() {
  try {
    if (newsClient) {
      try {
        if (newsClient.topology && newsClient.topology.isConnected()) return;
      } catch (e) {}
    }
    newsClient = new MongoClient(MONGODB_URI, { maxPoolSize: 5 });
    await newsClient.connect();
    const db = newsClient.db('MEZUKADB');
    newsCol = db.collection('news');
    await newsCol.createIndex({ createdAt: -1 }).catch(() => {});
    await newsCol.createIndex({ id: 1 }, { unique: true }).catch(() => {});
    console.log('✅ News DB initialized');
  } catch (e) {
    console.error('initNewsDB error:', e.message);
  }
}

// ── Admin auth check ─────────────────────────────────
function checkAdmin(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// ── Add a news article ──────────────────────────────
async function addNews({ image, caption, links }) {
  await initNewsDB();
  if (!caption || !caption.trim()) throw new Error('CAPTION_REQUIRED');

  const id = crypto.randomBytes(12).toString('hex');
  const doc = {
    id,
    image: image ? image.trim() : '',
    caption: caption.trim(),
    links: Array.isArray(links) ? links.filter(l => l && l.trim()) : [],
    reactions: {
      '😂': 0,
      '❤': 0,
      '👍': 0,
      '✔': 0,
      '😎': 0,
      '🐱': 0,
      '👤': 0
    },
    comments: [],
    createdAt: new Date()
  };
  await newsCol.insertOne(doc);
  return doc;
}

// ── Delete a news article ───────────────────────────
async function deleteNews(newsId) {
  await initNewsDB();
  const r = await newsCol.deleteOne({ id: newsId });
  return r.deletedCount > 0;
}

// ── Get all news (newest first) ─────────────────────
async function getNews() {
  await initNewsDB();
  const docs = await newsCol.find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return docs.map(d => ({
    id: d.id,
    image: d.image || '',
    caption: d.caption,
    links: d.links || [],
    reactions: d.reactions || { '😂': 0, '❤': 0, '👍': 0, '✔': 0, '😎': 0, '🐱': 0, '👤': 0 },
    comments: d.comments || [],
    createdAt: d.createdAt
  }));
}

// ── React to news ───────────────────────────────────
async function reactToNews(newsId, emoji) {
  await initNewsDB();
  const ALLOWED = ['😂', '❤', '👍', '✔', '😎', '🐱', '👤'];
  if (!ALLOWED.includes(emoji)) throw new Error('INVALID_EMOJI');
  
  const r = await newsCol.updateOne(
    { id: newsId },
    { $inc: { [`reactions.${emoji}`]: 1 } }
  );
  return r.matchedCount > 0;
}

// ── Add comment to news ─────────────────────────────
async function addNewsComment(newsId, { name, message }) {
  await initNewsDB();
  if (!name || !name.trim()) throw new Error('NAME_REQUIRED');
  if (!message || !message.trim()) throw new Error('MESSAGE_REQUIRED');
  if (name.trim().length > 60) throw new Error('NAME_TOO_LONG');
  if (message.trim().length > 1000) throw new Error('MESSAGE_TOO_LONG');

  const commentId = crypto.randomBytes(8).toString('hex');
  const comment = {
    id: commentId,
    name: name.trim(),
    message: message.trim(),
    replies: [],
    createdAt: new Date()
  };

  const r = await newsCol.updateOne(
    { id: newsId },
    { $push: { comments: comment } }
  );
  if (r.matchedCount === 0) throw new Error('NEWS_NOT_FOUND');
  return comment;
}

// ── Admin reply to a news comment ───────────────────
async function replyToNewsComment(newsId, commentId, replyMessage) {
  await initNewsDB();
  if (!replyMessage || !replyMessage.trim()) throw new Error('MESSAGE_REQUIRED');
  if (replyMessage.trim().length > 1000) throw new Error('MESSAGE_TOO_LONG');

  const replyId = crypto.randomBytes(6).toString('hex');
  const reply = {
    id: replyId,
    message: replyMessage.trim(),
    createdAt: new Date(),
    isAdmin: true
  };

  const r = await newsCol.updateOne(
    { id: newsId, 'comments.id': commentId },
    { $push: { 'comments.$.replies': reply } }
  );
  if (r.matchedCount === 0) throw new Error('COMMENT_NOT_FOUND');
  return reply;
}

// ── Delete comment from news ────────────────────────
async function deleteNewsComment(newsId, commentId) {
  await initNewsDB();
  const r = await newsCol.updateOne(
    { id: newsId },
    { $pull: { comments: { id: commentId } } }
  );
  return r.modifiedCount > 0;
}

// ── Register Express routes ─────────────────────────
function registerNewsRoutes(app) {

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    if (!checkAdmin(username, password)) return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    res.json({ ok: true, message: 'Login successful' });
  });

  // GET all news
  app.get('/api/news', async (req, res) => {
    try {
      const news = await getNews();
      res.json({ ok: true, news });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // POST add news (admin)
  app.post('/api/news/add', async (req, res) => {
    try {
      const { username, password, image, caption, links } = req.body;
      if (!checkAdmin(username, password)) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      const news = await addNews({ image, caption, links });
      res.json({ ok: true, news });
    } catch (e) {
      const status = e.message === 'CAPTION_REQUIRED' ? 400 : 500;
      res.status(status).json({ ok: false, error: e.message });
    }
  });

  // POST delete news (admin)
  app.post('/api/news/delete', async (req, res) => {
    try {
      const { username, password, newsId } = req.body;
      if (!checkAdmin(username, password)) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      const deleted = await deleteNews(newsId);
      res.json({ ok: true, deleted });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // POST react to news (user — no auth needed)
  app.post('/api/news/react', async (req, res) => {
    try {
      const { newsId, emoji } = req.body;
      if (!newsId || !emoji) return res.status(400).json({ ok: false, error: 'newsId and emoji required' });
      const ok = await reactToNews(newsId, emoji);
      res.json({ ok });
    } catch (e) {
      const status = e.message === 'INVALID_EMOJI' ? 400 : 500;
      res.status(status).json({ ok: false, error: e.message });
    }
  });

  // POST add comment to news (user)
  app.post('/api/news/comment/add', async (req, res) => {
    try {
      const { newsId, name, message } = req.body;
      if (!newsId) return res.status(400).json({ ok: false, error: 'newsId required' });
      const comment = await addNewsComment(newsId, { name, message });
      res.json({ ok: true, comment });
    } catch (e) {
      const status = ['NAME_REQUIRED', 'MESSAGE_REQUIRED', 'NAME_TOO_LONG', 'MESSAGE_TOO_LONG'].includes(e.message) ? 400 : e.message === 'NEWS_NOT_FOUND' ? 404 : 500;
      res.status(status).json({ ok: false, error: e.message });
    }
  });

  // POST admin reply to news comment
  app.post('/api/news/comment/reply', async (req, res) => {
    try {
      const { username, password, newsId, commentId, replyMessage } = req.body;
      if (!checkAdmin(username, password)) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      const reply = await replyToNewsComment(newsId, commentId, replyMessage);
      res.json({ ok: true, reply });
    } catch (e) {
      const status = e.message === 'COMMENT_NOT_FOUND' ? 404 : 500;
      res.status(status).json({ ok: false, error: e.message });
    }
  });

  // POST delete comment from news (admin)
  app.post('/api/news/comment/delete', async (req, res) => {
    try {
      const { username, password, newsId, commentId } = req.body;
      if (!checkAdmin(username, password)) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      const deleted = await deleteNewsComment(newsId, commentId);
      res.json({ ok: true, deleted });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  console.log('✅ News routes registered');
}

// Init DB at startup
initNewsDB().catch(e => console.error('News DB init failed:', e.message));

module.exports = { registerNewsRoutes };
