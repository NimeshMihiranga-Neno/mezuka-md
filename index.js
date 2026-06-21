require('dotenv').config({ path: './config.env' });
const path = require('path');
const config = require('./config');
const { MongoClient } = require('mongodb');
const { updateList, readEnv, defEnv, updateEnv, loadSettings, dpchange, savePassword, getPassword, signupReactUser, getReactUserInfo, deductReactCoins, claimDailyCoins, redeemCode } = require('./database');
const { registerCommentRoutes } = require('./comment');
const { registerNewsRoutes } = require('./news');
const { registerGiveawayRoutes } = require('./giveaway');
const { 
  connectToWA, main,
  addAutoReply, deleteAutoReply, listAutoReplies, toggleAutoReply, getAutoReplyStatus,
  addScheduledMessage, deleteScheduledMessage, listScheduledMessages, toggleScheduledMessages, getScheduledMessagesStatus,
  getArDB, newsletterReactCache
} = require('./main');

// MongoDB URI — ENV variable use karanna
const MAIN_MONGO_URI = process.env.MONGODB_URI || 'mongodb://example';

// MongoDB client (sessions save karanna)
const client = new MongoClient(MAIN_MONGO_URI, { maxPoolSize: 3 });

// =============================================
// EXPRESS SERVER
// =============================================
const express = require("express");
const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register comment routes
registerCommentRoutes(app);

// Register news routes
registerNewsRoutes(app);

// Register giveaway routes
registerGiveawayRoutes(app);

// Root "/" - domain open una gaman main.html (home page) show karanna
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'main.html'));
});

// image.js for dynamic frontend loading
app.get("/image.js", (req, res) => {
  res.sendFile(path.join(__dirname, 'image.js'));
});

// /home - direct home page access
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'main.html'));
});

// /pair - pair page
app.get("/pair", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'pair.html'));
});

// pair.html
app.get("/pair.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'pair.html'));
});

// team.html
app.get("/team.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'team.html'));
});

// contact.html
app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'contact.html'));
});

// news.html
app.get("/news.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'news.html'));
});

// giveaway.html
app.get("/giveaway.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'giveaway.html'));
});

app.get("/giveaway", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'giveaway.html'));
});

// admin.html
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'admin.html'));
});

// settings.html
app.get("/settings.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'settings.html'));
});

// /settings - direct access
app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'settings.html'));
});

// main.html direct access
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'main.html'));
});

// react.html
app.get("/react.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'react.html'));
});

app.get("/react", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'react.html'));
});

// shop.html
app.get("/shop.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'shop.html'));
});

app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'shop.html'));
});

// =============================================
// UPTIMEROBOT PING ENDPOINT - 24/7 Online
// =============================================
app.get("/ping", (req, res) => {
  res.json({ status: "alive", uptime: process.uptime() });
});

// =============================================
// /code ROUTE - Pairing Code Generator
// =============================================
// Usage: domain/code?number=94712345678
app.get("/code", async (req, res) => {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ error: 'Number parameter is required. Usage: /code?number=94712345678' });
  }

  const sanitizedNumber = number.replace(/[^0-9]/g, '');

  if (!sanitizedNumber || sanitizedNumber.length < 7) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  // Already connected check
  if (global.WA_SESSIONS && global.WA_SESSIONS.has(sanitizedNumber)) {
    return res.status(200).json({
      status: 'already_connected',
      message: 'This number is already connected.',
      number: sanitizedNumber
    });
  }

  console.log(`📞 Pairing code requested for ${sanitizedNumber}`);

  try {
    const {
      default: makeWASocket,
      useMultiFileAuthState,
      makeCacheableSignalKeyStore,
      fetchLatestBaileysVersion,
      Browsers,
      delay: waDelay
    } = require('@whiskeysockets/baileys');
    const P = require('pino');
    const fse = require('fs-extra');

    const sessionFolder = path.join(__dirname, 'auth_info_baileys', sanitizedNumber);
    await fse.ensureDir(sessionFolder);

    // Delete old creds if exist (fresh pairing)
    const credsFile = path.join(sessionFolder, 'creds.json');
    if (fse.existsSync(credsFile)) {
      await fse.remove(credsFile);
      console.log(`🗑️ Cleared old creds for ${sanitizedNumber}`);
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
    const logger = P({ level: 'silent' });
    const { version } = await fetchLatestBaileysVersion();

    const pairSocket = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      printQRInTerminal: false,
      logger,
      browser: Browsers.ubuntu('Chrome'),
    });

    // Save creds when updated
    pairSocket.ev.on('creds.update', saveCreds);

    // Handle connection update
    pairSocket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        console.log(`✅ Pairing successful for ${sanitizedNumber}`);

        try {
          const credsData = await fse.readJson(path.join(sessionFolder, 'creds.json'));

          await client.connect().catch(() => {});
          const dbSave = client.db('MEZUKADB1');
          const colSave = dbSave.collection(`${config.NENO_DATA}`);

          await colSave.updateOne(
            { ownerNumber: sanitizedNumber },
            { $set: { ownerNumber: sanitizedNumber, sid: credsData, updatedAt: new Date() } },
            { upsert: true }
          );

          console.log(`💾 Session saved to MongoDB for ${sanitizedNumber}`);

          try { await defEnv(sanitizedNumber); } catch(e) { console.error('defEnv error:', e.message); }
          try { await loadSettings(sanitizedNumber); } catch(e) { console.error('loadSettings error:', e.message); }

        } catch (saveErr) {
          console.error(`❌ Failed to save session to MongoDB:`, saveErr.message);
        }

        // pairSocket close karala main connectToWA eken handle karanna
        try { pairSocket.ws.close(); } catch(e) {}
        global.WA_SESSIONS.delete(sanitizedNumber);
        connectToWA(sanitizedNumber, sessionFolder);
      }

      if (connection === 'close') {
        const statusCode = new (require('@hapi/boom').Boom)(lastDisconnect?.error)?.output?.statusCode;
        const loggedOut = statusCode === 401;
        console.log(`⚠️ PairSocket closed for ${sanitizedNumber}, code: ${statusCode}`);
        if (!loggedOut && !global.WA_SESSIONS.has(sanitizedNumber)) {
          setTimeout(() => connectToWA(sanitizedNumber, sessionFolder), 3000);
        }
      }
    });

    // Request pairing code
    if (!pairSocket.authState.creds.registered) {
      let code;
      let retries = 5;
      while (retries > 0) {
        try {
          await waDelay(1500);
          code = await pairSocket.requestPairingCode(sanitizedNumber);
          break;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await waDelay(2000);
        }
      }

      // Format code nicely: XXXX-XXXX
      const formattedCode = code ? code.match(/.{1,4}/g)?.join('-') : code;

      console.log(`📋 Pairing code for ${sanitizedNumber}: ${formattedCode}`);

      if (!res.headersSent) {
        return res.json({
          status: 'success',
          number: sanitizedNumber,
          code: formattedCode,
          message: `WhatsApp > Linked Devices > Link a Device > Enter Code`
        });
      }
    } else {
      // Already registered - just connect
      if (!global.WA_SESSIONS.has(sanitizedNumber)) {
        connectToWA(sanitizedNumber, sessionFolder);
      }
      if (!res.headersSent) {
        return res.json({
          status: 'already_registered',
          message: 'Number already has a session. Reconnecting...',
          number: sanitizedNumber
        });
      }
    }

  } catch (err) {
    console.error(`❌ Pairing error for ${sanitizedNumber}:`, err);
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Failed to generate pairing code',
        message: err.message || 'Unknown error',
        number: sanitizedNumber
      });
    }
  }
});

// =============================================
// QR SESSION STORE - Live QR data per session
// =============================================
if (!global.QR_SESSIONS) global.QR_SESSIONS = new Map();
// Structure: sessionId => { qr, status: 'pending'|'success'|'failed'|'expired', number, updatedAt }

// =============================================
// /api/qr ROUTE - Start QR Session (returns sessionId immediately)
// =============================================
app.get("/api/qr", async (req, res) => {
  const sessionId = "qr_" + Date.now();
  console.log(`📱 QR Pairing requested: ${sessionId}`);

  // Register session immediately so frontend can poll
  global.QR_SESSIONS.set(sessionId, {
    qr: null,
    status: 'pending',
    number: null,
    updatedAt: Date.now()
  });

  // Return sessionId immediately — frontend will poll /api/qr/poll
  res.json({ status: 'pending', sessionId, message: 'QR session started. Poll /api/qr/poll for QR.' });

  // Auto-cleanup session after 3 minutes if not connected
  const SESSION_TIMEOUT = setTimeout(() => {
    const sess = global.QR_SESSIONS.get(sessionId);
    if (sess && sess.status === 'pending') {
      global.QR_SESSIONS.set(sessionId, { ...sess, status: 'expired', updatedAt: Date.now() });
      // Clean up after additional 30s
      setTimeout(() => global.QR_SESSIONS.delete(sessionId), 30000);
    }
  }, 3 * 60 * 1000);

  // Start socket in background
  try {
    const {
      default: makeWASocket,
      useMultiFileAuthState,
      makeCacheableSignalKeyStore,
      fetchLatestBaileysVersion,
      Browsers,
    } = require('@whiskeysockets/baileys');
    const P = require('pino');
    const fse = require('fs-extra');

    const sessionFolder = path.join(__dirname, 'auth_info_baileys', sessionId);
    await fse.ensureDir(sessionFolder);

    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
    const logger = P({ level: 'silent' });
    const { version } = await fetchLatestBaileysVersion();

    const pairSocket = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      printQRInTerminal: false,
      logger,
      browser: Browsers.ubuntu('Chrome'),
    });

    pairSocket.ev.on('creds.update', saveCreds);

    pairSocket.ev.on('connection.update', async (update) => {
      const { connection, qr, lastDisconnect } = update;

      // ✅ Always update QR whenever Baileys fires a new one (auto-refresh support)
      if (qr) {
        console.log(`🔄 QR updated for session: ${sessionId}`);
        global.QR_SESSIONS.set(sessionId, {
          qr,
          status: 'pending',
          number: null,
          updatedAt: Date.now()
        });
      }

      if (connection === 'open') {
        const actualNumber = pairSocket.user.id.split(':')[0];
        console.log(`✅ QR Pairing successful for ${actualNumber}`);

        // Mark session as success
        clearTimeout(SESSION_TIMEOUT);
        global.QR_SESSIONS.set(sessionId, {
          qr: null,
          status: 'success',
          number: actualNumber,
          updatedAt: Date.now()
        });
        // Clean stored session entry after 60s
        setTimeout(() => global.QR_SESSIONS.delete(sessionId), 60000);

        try {
          const credsData = await fse.readJson(path.join(sessionFolder, 'creds.json'));

          await client.connect().catch(() => {});
          const dbSave = client.db('MEZUKADB1');
          const colSave = dbSave.collection(`${config.NENO_DATA}`);

          const newFolder = path.join(__dirname, 'auth_info_baileys', actualNumber);
          if (fse.existsSync(newFolder)) await fse.remove(newFolder);
          await fse.copy(sessionFolder, newFolder);
          await fse.remove(sessionFolder);

          await colSave.updateOne(
            { ownerNumber: actualNumber },
            { $set: { ownerNumber: actualNumber, sid: credsData, updatedAt: new Date() } },
            { upsert: true }
          );

          try { await defEnv(actualNumber); } catch(e) {}
          try { await loadSettings(actualNumber); } catch(e) {}

          try { pairSocket.ws.close(); } catch(e) {}

          if (global.WA_SESSIONS && global.WA_SESSIONS.has(actualNumber)) {
            try { global.WA_SESSIONS.get(actualNumber).ws.close(); } catch(e) {}
            global.WA_SESSIONS.delete(actualNumber);
          }

          connectToWA(actualNumber, newFolder);
        } catch (saveErr) {
          console.error(`❌ QR Session save failed:`, saveErr);
        }
      }

      if (connection === 'close') {
        const sess = global.QR_SESSIONS.get(sessionId);
        // Only mark as failed if we haven't succeeded yet
        if (sess && sess.status === 'pending') {
          console.log(`⚠️ QR session closed without scan: ${sessionId}`);
          global.QR_SESSIONS.set(sessionId, { ...sess, status: 'failed', updatedAt: Date.now() });
          clearTimeout(SESSION_TIMEOUT);
          setTimeout(() => {
            global.QR_SESSIONS.delete(sessionId);
            try { fse.remove(sessionFolder); } catch(e) {}
          }, 30000);
        }
        // Cleanup socket folder for pending sessions
        setTimeout(() => {
          try { pairSocket.ws.close(); } catch(e) {}
          if (!fse.existsSync(path.join(__dirname, 'auth_info_baileys', sessionId.replace('qr_', '')))) {
            try { fse.remove(sessionFolder); } catch(e) {}
          }
        }, 3000);
      }
    });

  } catch (err) {
    console.error(`❌ QR Generation error:`, err);
    global.QR_SESSIONS.set(sessionId, { qr: null, status: 'failed', number: null, updatedAt: Date.now() });
  }
});

// =============================================
// /api/qr/poll ROUTE - Get latest QR for a session
// =============================================
app.get("/api/qr/poll", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.json({ status: 'failed', error: 'No sessionId' });

  const sess = global.QR_SESSIONS.get(sessionId);
  if (!sess) {
    // Session not found — either never existed or cleaned up
    return res.json({ status: 'failed', error: 'Session not found or expired' });
  }

  return res.json({
    status: sess.status,       // 'pending' | 'success' | 'failed' | 'expired'
    qr: sess.qr || null,       // null until first QR fires
    number: sess.number || null,
    updatedAt: sess.updatedAt
  });
});

// =============================================
// /api/qr/status ROUTE - Legacy QR status check (kept for compat)
// =============================================
app.get("/api/qr/status", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.json({ status: 'pending' });
  const sess = global.QR_SESSIONS.get(sessionId);
  if (!sess) return res.json({ status: 'success' }); // folder gone = completed
  if (sess.status === 'success') return res.json({ status: 'success', number: sess.number });
  return res.json({ status: 'pending' });
});

app.use(express.json());

// ─── COMMENT ROUTES ─────────────────────────────
registerCommentRoutes(app);
// ────────────────────────────────────────────────

// Settings HTML page
app.get("/settings.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
});

// ─── SETTINGS API ───────────────────────────────

// Login
app.post("/api/settings/login", async (req, res) => {
  try {
    const { number, password } = req.body;
    if (!number || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const sanitized = number.replace(/[^0-9]/g, '');
    const saved = await getPassword(sanitized);
    if (!saved || saved !== password.toUpperCase()) {
      return res.status(401).json({ ok: false, error: 'Invalid number or password' });
    }
    res.json({ ok: true, number: sanitized });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get settings
app.post("/api/settings/get", async (req, res) => {
  try {
    const { number, password } = req.body;
    if (!number || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const sanitized = number.replace(/[^0-9]/g, '');
    const saved = await getPassword(sanitized);
    if (!saved || saved !== password.toUpperCase()) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    const settings = await readEnv(sanitized);
    res.json({ ok: true, settings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Update single setting
app.post("/api/settings/update", async (req, res) => {
  try {
    const { number, password, key, value } = req.body;
    if (!number || !password || !key) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const sanitized = number.replace(/[^0-9]/g, '');
    const saved = await getPassword(sanitized);
    if (!saved || saved !== password.toUpperCase()) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await updateEnv(sanitized, key, value);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── AUTO REPLY API ──────────────────────────────────────────

// Helper: auth check
async function checkAuth(number, password) {
  const sanitized = number.replace(/[^0-9]/g, '');
  const saved = await getPassword(sanitized);
  if (!saved || saved !== password.toUpperCase()) return null;
  return sanitized;
}

// List auto replies
app.post("/api/autoreply/list", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    const replies = await listAutoReplies(san);
    const enabled = await getAutoReplyStatus(san);
    res.json({ ok: true, replies, enabled });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Add auto reply
app.post("/api/autoreply/add", async (req, res) => {
  try {
    const { number, password, trigger, response } = req.body;
    if (!trigger || !response) return res.status(400).json({ ok: false, error: 'trigger and response are required' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await addAutoReply(san, trigger, response);
    res.json({ ok: true, message: 'Auto reply added successfully' });
  } catch (err) {
    if (err.message === 'MAX_LIMIT_REACHED') return res.status(400).json({ ok: false, error: 'Maximum 20 auto-replies allowed' });
    if (err.message === 'TRIGGER_EXISTS') return res.status(400).json({ ok: false, error: 'Trigger already exists' });
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete auto reply
app.post("/api/autoreply/delete", async (req, res) => {
  try {
    const { number, password, trigger } = req.body;
    if (!trigger) return res.status(400).json({ ok: false, error: 'trigger is required' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await deleteAutoReply(san, trigger);
    res.json({ ok: true, message: 'Auto reply deleted successfully' });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Toggle auto reply on/off
app.post("/api/autoreply/toggle", async (req, res) => {
  try {
    const { number, password, enabled } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await toggleAutoReply(san, enabled);
    res.json({ ok: true, message: `Auto reply ${enabled ? 'ON' : 'OFF'}` });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// ─── SCHEDULED MESSAGES API ─────────────────────────────────

// List scheduled messages
app.post("/api/scheduled/list", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    const messages = await listScheduledMessages(san);
    const enabled = await getScheduledMessagesStatus(san);
    res.json({ ok: true, messages, enabled });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Add scheduled message
app.post("/api/scheduled/add", async (req, res) => {
  try {
    const { number, password, recipientNumber, recipientName, day, time, message } = req.body;
    if (!recipientNumber || !day || !time || !message) return res.status(400).json({ ok: false, error: 'recipientNumber, day, time, message are required' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    const id = await addScheduledMessage(san, { recipientNumber, recipientName, day, time, message });
    res.json({ ok: true, message: 'Scheduled message added successfully', id });
  } catch (err) {
    if (err.message === 'MAX_LIMIT_REACHED') return res.status(400).json({ ok: false, error: 'Maximum 20 scheduled messages allowed' });
    if (err.message === 'MESSAGE_REQUIRED') return res.status(400).json({ ok: false, error: 'Message required' });
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete scheduled message
app.post("/api/scheduled/delete", async (req, res) => {
  try {
    const { number, password, id } = req.body;
    if (!id) return res.status(400).json({ ok: false, error: 'id is required' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await deleteScheduledMessage(san, id);
    res.json({ ok: true, message: 'Scheduled message deleted successfully' });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// ── REACT PANEL API ───────────────────────────────────────

// Signup/Login for react
app.post("/api/react/auth", async (req, res) => {
  try {
    const { number, username, password } = req.body;
    if (!number || !password) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const san = number.replace(/[^0-9]/g, '');
    
    // signupReactUser handles awards logic
    const result = await signupReactUser(san, username || "User", password);
    if (!result.ok) return res.status(401).json(result);
    
    res.json(result);
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Get user info (coins)
app.post("/api/react/user", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    
    const info = await getReactUserInfo(san);
    res.json({ ok: true, ...info });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Add reaction task
app.post("/api/react/add-task", async (req, res) => {
  try {
    const { number, password, jid, emojis, days } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    
    if (!jid || !days) return res.status(400).json({ ok: false, error: 'Missing jid or days' });
    
    const cost = parseInt(days) * 10;
    const deducted = await deductReactCoins(san, cost);
    if (!deducted) return res.status(400).json({ ok: false, error: 'Insufficient coins' });
    
    const arDB = getArDB();
    const col = arDB.collection('newsletter_reacts');
    
    let targetJid = jid.trim();
    
    // Check if it's a link
    if (targetJid.includes('whatsapp.com/channel/')) {
      targetJid = targetJid.split('channel/')[1].split('/')[0].split('?')[0] + '@newsletter';
    } else if (targetJid.includes('chat.whatsapp.com/')) {
      // Group link, but user asked for channel/jid specifically. 
      // For now, let's treat it as a newsletter ID if it's just the ID part.
      targetJid = targetJid.split('chat.whatsapp.com/')[1].split('/')[0].split('?')[0] + '@newsletter';
    } else if (!targetJid.includes('@')) {
      // If it's just a raw ID like 120363402094635383
      targetJid = targetJid + '@newsletter';
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + parseInt(days));
    
    const emojiArray = emojis ? emojis.split(',').map(e => e.trim()).filter(Boolean) : [];
    
    await col.updateOne(
      { jid: targetJid, ownerNumber: san },
      { $set: { jid: targetJid, ownerNumber: san, emojis: emojiArray, expiryDate: expiry, createdAt: new Date() } },
      { upsert: true }
    );
    
    // Update cache
    newsletterReactCache.set(targetJid, { jid: targetJid, ownerNumber: san, emojis: emojiArray, expiryDate: expiry });
    
    res.json({ ok: true, expiry });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// List reaction tasks
app.post("/api/react/list-tasks", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    
    const arDB = getArDB();
    const col = arDB.collection('newsletter_reacts');
    const tasks = await col.find({ ownerNumber: san }).toArray();
    
    res.json({ ok: true, tasks });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Daily coin claim
app.post("/api/react/daily-claim", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    
    const result = await claimDailyCoins(san);
    res.json(result);
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Redeem code for coins
app.post("/api/react/redeem", async (req, res) => {
  try {
    const { number, password, code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'Code is required' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });

    const result = await redeemCode(san, code.trim().toUpperCase());
    res.json(result);
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// ─── GROUP AUTOMATION API ────────────────────────────────────

// Get group automation settings
app.post("/api/group-automation/get", async (req, res) => {
  try {
    const { number, password } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    const settings = await readEnv(san);
    res.json({
      ok: true,
      WELCOME: settings.WELCOME || 'false',
      WELCOME_MSG: settings.WELCOME_MSG || '👋 Welcome to *{groupName}*!\n\nHey @{member}, glad you joined us! 🎉',
      GOODBYE: settings.GOODBYE || 'false',
      GOODBYE_MSG: settings.GOODBYE_MSG || '👋 *{groupName}* says goodbye to @{member}!\nWe\'ll miss you! 😢',
      ANTI_BAD: settings.ANTI_BAD || 'false',
      ANTI_BAD_WORDS: settings.ANTI_BAD_WORDS || 'fuck,shit,bitch,asshole,bastard',
      ANTI_BAD_ACTION: settings.ANTI_BAD_ACTION || 'warn',
      ANTI_LINK: settings.ANTI_LINK || 'false',
      ANTI_LINK_ACTION: settings.ANTI_LINK_ACTION || 'warn',
      ANTI_LINK_ALLOW: settings.ANTI_LINK_ALLOW || '',
      GROUP_SCOPE: settings.GROUP_SCOPE || 'all',
      MY_GROUP_LINKS: settings.MY_GROUP_LINKS || ''
    });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Update group automation setting (key/value)
app.post("/api/group-automation/update", async (req, res) => {
  try {
    const { number, password, key, value } = req.body;
    const ALLOWED_KEYS = ['WELCOME','WELCOME_MSG','GOODBYE','GOODBYE_MSG','ANTI_BAD','ANTI_BAD_WORDS','ANTI_BAD_ACTION','ANTI_LINK','ANTI_LINK_ACTION','ANTI_LINK_ALLOW','GROUP_SCOPE','MY_GROUP_LINKS'];
    if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ ok: false, error: 'Invalid key' });
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await updateEnv(san, key, value);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Bulk save group automation settings
app.post("/api/group-automation/save", async (req, res) => {
  try {
    const { number, password, settings } = req.body;
    const ALLOWED_KEYS = ['WELCOME','WELCOME_MSG','GOODBYE','GOODBYE_MSG','ANTI_BAD','ANTI_BAD_WORDS','ANTI_BAD_ACTION','ANTI_LINK','ANTI_LINK_ACTION','ANTI_LINK_ALLOW','GROUP_SCOPE','MY_GROUP_LINKS'];
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    for (const [key, value] of Object.entries(settings)) {
      if (ALLOWED_KEYS.includes(key)) await updateEnv(san, key, value);
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// Toggle all scheduled messages on/off
app.post("/api/scheduled/toggle", async (req, res) => {
  try {
    const { number, password, enabled } = req.body;
    const san = await checkAuth(number, password);
    if (!san) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    await toggleScheduledMessages(san, enabled);
    res.json({ ok: true, message: `Scheduled messages ${enabled ? 'ON' : 'OFF'}` });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// ─── SESSIONS API ───────────────────────────────

// Get all connected sessions
app.get("/api/sessions", async (req, res) => {
  try {
    if (!global.WA_SESSIONS) {
      return res.json({ ok: true, sessions: [] });
    }

    const sessions = [];
    for (const [ownerNumber, connection] of global.WA_SESSIONS.entries()) {
      const isConnected = connection && connection.user !== undefined;
      sessions.push({
        number: ownerNumber,
        status: isConnected ? 'connected' : 'disconnected',
        lastUpdate: new Date().toISOString(),
        jid: isConnected ? connection.user.id : null
      });
    }

    res.json({ ok: true, sessions, count: sessions.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🌐 Express server listening at http://localhost:${port}`);
});

// =============================================
// RUN MAIN - startup session load
// =============================================
main();

// =============================================
// SMART HEALTH CHECK - only reconnect DROPPED sessions
// (does NOT restart already-connected sessions)
// =============================================
const { MongoClient: HCMongoClient } = require('mongodb');
const fseHC = require('fs-extra');

setInterval(async () => {
  console.log(`🔍 [HEALTH] Checking for dropped sessions...`);

  let hcClient;
  try {
    hcClient = new HCMongoClient(process.env.MONGODB_URI || 'mongodb://example', { maxPoolSize: 2 });

    // MongoDB connect with retry
    let connected = false;
    for (let i = 1; i <= 3; i++) {
      try {
        await hcClient.connect();
        connected = true;
        break;
      } catch (e) {
        console.log(`⚠️ [HEALTH] MongoDB connect attempt ${i}/3: ${e.message}`);
        if (i < 3) await new Promise(r => setTimeout(r, 3000));
      }
    }

    if (!connected) {
      console.log(`❌ [HEALTH] Cannot connect to MongoDB. Skipping health check.`);
      return;
    }

    const col = hcClient.db('MEZUKADB1').collection(`${config.NENO_DATA}`);
    const docs = await col.find({}).toArray();

    let reconnected = 0;
    for (const doc of docs) {
      const { ownerNumber, sid } = doc;
      if (!ownerNumber || !sid) continue;

      // ✅ Already connected - do NOT disturb
      if (global.WA_SESSIONS && global.WA_SESSIONS.has(ownerNumber)) continue;

      // ❌ Not connected - reconnect this dropped session
      console.log(`🔁 [HEALTH] ${ownerNumber} is dropped. Reconnecting...`);
      try {
        const sessionFolder = path.join(__dirname, 'auth_info_baileys', ownerNumber);
        await fseHC.ensureDir(sessionFolder);
        await fseHC.writeFile(path.join(sessionFolder, 'creds.json'), JSON.stringify(sid));
        connectToWA(ownerNumber, sessionFolder);
        reconnected++;
      } catch (err) {
        console.log(`❌ [HEALTH] Failed to reconnect ${ownerNumber}: ${err.message}`);
      }
    }

    if (reconnected > 0) {
      console.log(`✅ [HEALTH] Reconnected ${reconnected} dropped session(s).`);
    } else {
      console.log(`✅ [HEALTH] All ${docs.length} session(s) are healthy.`);
    }

  } catch (err) {
    console.log(`❌ [HEALTH] Health check error: ${err.message}`);
  } finally {
    try { if (hcClient) await hcClient.close(); } catch (_) {}
  }
}, 5 * 60 * 60 * 1000); // Every 5 hours - ONLY reconnects dropped sessions

