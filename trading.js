// ============================================================
// MEZUKA TRADING SYSTEM - trading.js
// Express Router for all trading platform APIs
// ============================================================
require('dotenv').config({ path: './config.env' });

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// ── CONFIG ────────────────────────────────────────────────────
const MONGO_URI = process.env.TRADING_MONGO_URL || process.env.MONGODB_URI;
const JWT_SECRET = process.env.TRADING_JWT_SECRET || 'mezuka_trading_fallback_secret';
const EMAIL_USER = process.env.TRADING_EMAIL || '';
const EMAIL_PASS = process.env.TRADING_EMAIL_PASS || '';

// ── SIMPLE JWT (no external lib) ─────────────────────────────
function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function signJWT(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Date.now() }));
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}
function verifyJWT(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch { return null; }
}

// ── SIMPLE BCRYPT-LIKE HASH (using sha256 + salt) ────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return check === hash;
}

// ── MONGODB ───────────────────────────────────────────────────
let db = null;
const mongoClient = new MongoClient(MONGO_URI, { maxPoolSize: 5 });

async function getDb() {
  if (!db) {
    await mongoClient.connect().catch(() => {});
    db = mongoClient.db('MEZUKADB');
  }
  return db;
}

// Collections
const COL_USERS = 'trading_users';
const COL_TRADES = 'trading_trades';
const COL_P2P = 'trading_p2p';
const COL_PURCHASES = 'trading_purchases';

// ── MARKET PRICES (in-memory, simulated) ─────────────────────
const COINS = ['RED', 'GREEN', 'MEZUKA', 'UP', 'ROOT'];
const marketPrices = {
  RED:    { price: 45.0,  history: [] },
  GREEN:  { price: 28.5,  history: [] },
  MEZUKA: { price: 120.0, history: [] },
  UP:     { price: 67.5,  history: [] },
  ROOT:   { price: 15.0,  history: [] }
};

// Seed initial history (last 30 points)
COINS.forEach(coin => {
  let p = marketPrices[coin].price;
  for (let i = 29; i >= 0; i--) {
    const change = (Math.random() - 0.48) * p * 0.06;
    p = Math.max(1, p + change);
    marketPrices[coin].history.unshift(parseFloat(p.toFixed(4)));
  }
  marketPrices[coin].price = marketPrices[coin].history[marketPrices[coin].history.length - 1];
});

// Price update loop every 15 seconds
setInterval(() => {
  COINS.forEach(coin => {
    const current = marketPrices[coin].price;
    const change = (Math.random() - 0.48) * current * 0.04;
    const newPrice = parseFloat(Math.max(0.5, current + change).toFixed(4));
    marketPrices[coin].price = newPrice;
    marketPrices[coin].history.push(newPrice);
    if (marketPrices[coin].history.length > 100) {
      marketPrices[coin].history.shift();
    }
  });
}, 15000);

// ── EMAIL OTP ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

async function sendOtpEmail(email, otp, username) {
  const mailOptions = {
    from: `"Mezuka Trading" <${EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your Mezuka Trading OTP Code',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Inter,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#111111;border:1px solid rgba(220,38,38,0.2);border-radius:20px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#991b1b,#7f1d1d);padding:32px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:26px;letter-spacing:-1px;">🪙 Mezuka Trading</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Email Verification</p>
    </div>
    <div style="padding:36px 32px;">
      <p style="color:#f5f5f5;font-size:16px;margin:0 0 8px;">Hey <strong>${username}</strong>! 👋</p>
      <p style="color:#888;font-size:14px;margin:0 0 28px;line-height:1.6;">
        Welcome to Mezuka Trading Platform! Use the OTP below to verify your email and activate your account.
        You'll receive <strong style="color:#ef4444;">200 FREE NENO coins</strong> as a welcome bonus! 🎉
      </p>
      <div style="background:#1a1a1a;border:1px solid rgba(220,38,38,0.3);border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your OTP Code</p>
        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:10px;color:#ef4444;font-family:monospace;">${otp}</p>
        <p style="margin:12px 0 0;color:#555;font-size:11px;">Expires in 10 minutes</p>
      </div>
      <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
        If you didn't request this, ignore this email. Never share your OTP with anyone.
      </p>
    </div>
    <div style="background:#0a0a0a;padding:16px;text-align:center;border-top:1px solid rgba(220,38,38,0.1);">
      <p style="margin:0;color:#444;font-size:11px;">© 2024 Mezuka Trading · Black Cat Studio</p>
    </div>
  </div>
</body>
</html>`
  };
  await transporter.sendMail(mailOptions);
}

// ── AUTH MIDDLEWARE ───────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Authentication required' });
  }
  const token = auth.slice(7);
  const payload = verifyJWT(token);
  if (!payload) return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
  req.userId = payload.userId;
  req.userEmail = payload.email;
  next();
}

// ── HELPER: Get user by ID ────────────────────────────────────
async function getUserById(userId) {
  const database = await getDb();
  return database.collection(COL_USERS).findOne({ _id: new ObjectId(userId) });
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

// ── SERVE HTML PAGES ─────────────────────────────────────────
router.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'profile.html'));
});
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'profile.html'));
});
router.get('/tradings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'tradings.html'));
});
router.get('/tradings', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'tradings.html'));
});
router.get('/exchange.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'exchange.html'));
});
router.get('/exchange', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'exchange.html'));
});
router.get('/toolshop.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'toolshop.html'));
});
router.get('/toolshop', (req, res) => {
  res.sendFile(path.join(__dirname, 'mezuka', 'toolshop.html'));
});

// ─────────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────────

// POST /api/trading/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, whatsapp } = req.body;
    if (!username || !email || !password || !whatsapp) {
      return res.status(400).json({ ok: false, error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
    }

    const database = await getDb();
    const col = database.collection(COL_USERS);

    // Check existing
    const existing = await col.findOne({ email: email.toLowerCase() });
    if (existing && existing.verified) {
      return res.status(400).json({ ok: false, error: 'Email already registered. Please login.' });
    }

    const userData = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      whatsapp: whatsapp.trim(),
      profileImage: '',
      verified: true,
      otp: null,
      otpExpiry: null,
      coins: { NENO: 200, RED: 0, GREEN: 0, MEZUKA: 0, UP: 0, ROOT: 0 },
      tradeHistory: [],
      createdAt: new Date()
    };

    if (existing && !existing.verified) {
      await col.updateOne(
        { email: email.toLowerCase() },
        { $set: { ...userData } }
      );
    } else {
      await col.insertOne(userData);
    }

    const newUser = await col.findOne({ email: email.toLowerCase() });
    const token = signJWT({ userId: newUser._id.toString(), email: newUser.email });

    res.json({
      ok: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        whatsapp: newUser.whatsapp,
        profileImage: newUser.profileImage,
        coins: newUser.coins
      },
      message: '🎉 Account created! 200 NENO coins added to your wallet!'
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ ok: false, error: 'Email and OTP required' });

    const database = await getDb();
    const col = database.collection(COL_USERS);
    const user = await col.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if (user.verified) return res.status(400).json({ ok: false, error: 'Account already verified. Please login.' });
    if (user.otp !== otp) return res.status(400).json({ ok: false, error: 'Invalid OTP code' });
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ ok: false, error: 'OTP expired. Please signup again.' });
    }

    // Activate account + give 200 NENO welcome bonus
    await col.updateOne(
      { email: email.toLowerCase() },
      { $set: { verified: true, otp: null, otpExpiry: null, 'coins.NENO': 200 } }
    );

    const updatedUser = await col.findOne({ email: email.toLowerCase() });
    const token = signJWT({ userId: updatedUser._id.toString(), email: updatedUser.email });

    res.json({
      ok: true,
      token,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        whatsapp: updatedUser.whatsapp,
        profileImage: updatedUser.profileImage,
        coins: updatedUser.coins
      },
      message: '🎉 Account verified! 200 NENO coins added to your wallet!'
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required' });

    const database = await getDb();
    const user = await database.collection(COL_USERS).findOne({ email: email.toLowerCase() });

    if (!user) return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    if (!user.verified) return res.status(401).json({ ok: false, error: 'Account not verified. Please check your email for the OTP.' });
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }

    const token = signJWT({ userId: user._id.toString(), email: user.email });

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        whatsapp: user.whatsapp,
        profileImage: user.profileImage,
        coins: user.coins
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// USER PROFILE ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/trading/profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        whatsapp: user.whatsapp,
        profileImage: user.profileImage,
        coins: user.coins,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PUT /api/trading/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { username, email, whatsapp, profileImage } = req.body;
    const database = await getDb();
    const updateData = {};
    if (username) updateData.username = username.trim();
    if (email) {
      // Check if email taken by another user
      const existing = await database.collection(COL_USERS).findOne({
        email: email.toLowerCase(),
        _id: { $ne: new ObjectId(req.userId) }
      });
      if (existing) return res.status(400).json({ ok: false, error: 'Email already in use' });
      updateData.email = email.toLowerCase().trim();
    }
    if (whatsapp) updateData.whatsapp = whatsapp.trim();
    if (profileImage !== undefined) updateData.profileImage = profileImage.trim();

    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updateData }
    );
    const user = await getUserById(req.userId);
    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        whatsapp: user.whatsapp,
        profileImage: user.profileImage,
        coins: user.coins
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PUT /api/trading/profile/password
router.put('/profile/password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ ok: false, error: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ ok: false, error: 'New password must be at least 6 characters' });

    const database = await getDb();
    const user = await getUserById(req.userId);
    if (!verifyPassword(oldPassword, user.password)) {
      return res.status(401).json({ ok: false, error: 'Current password is incorrect' });
    }
    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { password: hashPassword(newPassword) } }
    );
    res.json({ ok: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// MARKET ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/trading/market
router.get('/market', (req, res) => {
  const prices = {};
  const history = {};
  COINS.forEach(coin => {
    prices[coin] = marketPrices[coin].price;
    history[coin] = marketPrices[coin].history.slice(-50);
  });
  res.json({ ok: true, prices, history });
});

// ─────────────────────────────────────────────────────────────
// TRADE ROUTES
// ─────────────────────────────────────────────────────────────

// POST /api/trading/buy
router.post('/buy', requireAuth, async (req, res) => {
  try {
    const { coin, amount } = req.body;
    if (!COINS.includes(coin)) return res.status(400).json({ ok: false, error: 'Invalid coin' });
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return res.status(400).json({ ok: false, error: 'Invalid amount' });

    const database = await getDb();
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    const price = marketPrices[coin].price;
    const totalCost = parseFloat((price * qty).toFixed(4));

    if (user.coins.NENO < totalCost) {
      return res.status(400).json({ ok: false, error: `Insufficient NENO balance. Need ${totalCost} NENO, have ${user.coins.NENO}` });
    }

    const newNeno = parseFloat((user.coins.NENO - totalCost).toFixed(4));
    const newCoin = parseFloat(((user.coins[coin] || 0) + qty).toFixed(4));

    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { 'coins.NENO': newNeno, [`coins.${coin}`]: newCoin } }
    );

    const trade = {
      userId: new ObjectId(req.userId),
      coin,
      type: 'buy',
      amount: qty,
      price,
      total: totalCost,
      timestamp: new Date()
    };
    await database.collection(COL_TRADES).insertOne(trade);

    res.json({
      ok: true,
      message: `Bought ${qty} ${coin} for ${totalCost} NENO`,
      coins: { ...user.coins, NENO: newNeno, [coin]: newCoin },
      trade: { coin, type: 'buy', amount: qty, price, total: totalCost }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/sell
router.post('/sell', requireAuth, async (req, res) => {
  try {
    const { coin, amount } = req.body;
    if (!COINS.includes(coin)) return res.status(400).json({ ok: false, error: 'Invalid coin' });
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return res.status(400).json({ ok: false, error: 'Invalid amount' });

    const database = await getDb();
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    if ((user.coins[coin] || 0) < qty) {
      return res.status(400).json({ ok: false, error: `Insufficient ${coin} balance` });
    }

    const price = marketPrices[coin].price;
    const totalReturn = parseFloat((price * qty).toFixed(4));

    const newCoin = parseFloat(((user.coins[coin] || 0) - qty).toFixed(4));
    const newNeno = parseFloat((user.coins.NENO + totalReturn).toFixed(4));

    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { [`coins.${coin}`]: newCoin, 'coins.NENO': newNeno } }
    );

    const trade = {
      userId: new ObjectId(req.userId),
      coin,
      type: 'sell',
      amount: qty,
      price,
      total: totalReturn,
      timestamp: new Date()
    };
    await database.collection(COL_TRADES).insertOne(trade);

    res.json({
      ok: true,
      message: `Sold ${qty} ${coin} for ${totalReturn} NENO`,
      coins: { ...user.coins, NENO: newNeno, [coin]: newCoin },
      trade: { coin, type: 'sell', amount: qty, price, total: totalReturn }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/trading/history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const database = await getDb();
    const trades = await database.collection(COL_TRADES)
      .find({ userId: new ObjectId(req.userId) })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json({ ok: true, trades });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// P2P EXCHANGE ROUTES
// ─────────────────────────────────────────────────────────────

const ALL_COINS = ['NENO', 'RED', 'GREEN', 'MEZUKA', 'UP', 'ROOT'];

// GET /api/trading/p2p
router.get('/p2p', async (req, res) => {
  try {
    const database = await getDb();
    const listings = await database.collection(COL_P2P)
      .find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json({ ok: true, listings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/p2p/create
router.post('/p2p/create', requireAuth, async (req, res) => {
  try {
    const { fromCoin, toCoin, amount, price } = req.body;
    if (!ALL_COINS.includes(fromCoin) || !ALL_COINS.includes(toCoin)) {
      return res.status(400).json({ ok: false, error: 'Invalid coin' });
    }
    if (fromCoin === toCoin) return res.status(400).json({ ok: false, error: 'Cannot exchange same coin' });
    const qty = parseFloat(amount);
    const prc = parseFloat(price);
    if (!qty || qty <= 0 || !prc || prc <= 0) {
      return res.status(400).json({ ok: false, error: 'Invalid amount or price' });
    }

    const database = await getDb();
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    if ((user.coins[fromCoin] || 0) < qty) {
      return res.status(400).json({ ok: false, error: `Insufficient ${fromCoin} balance` });
    }

    // Lock (deduct) coins from seller
    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $inc: { [`coins.${fromCoin}`]: -qty } }
    );

    const listing = {
      sellerId: new ObjectId(req.userId),
      sellerName: user.username,
      fromCoin,
      toCoin,
      amount: qty,
      price: prc,
      status: 'open',
      createdAt: new Date()
    };
    const result = await database.collection(COL_P2P).insertOne(listing);
    res.json({ ok: true, listingId: result.insertedId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/p2p/accept/:id
router.post('/p2p/accept/:id', requireAuth, async (req, res) => {
  try {
    const database = await getDb();
    let listingId;
    try { listingId = new ObjectId(req.params.id); }
    catch { return res.status(400).json({ ok: false, error: 'Invalid listing ID' }); }

    const listing = await database.collection(COL_P2P).findOne({ _id: listingId, status: 'open' });
    if (!listing) return res.status(404).json({ ok: false, error: 'Listing not found or already closed' });
    if (listing.sellerId.toString() === req.userId) {
      return res.status(400).json({ ok: false, error: 'Cannot accept your own listing' });
    }

    const buyer = await getUserById(req.userId);
    if (!buyer) return res.status(404).json({ ok: false, error: 'User not found' });

    // Buyer needs: listing.amount * listing.price of toCoin (what buyer pays)
    const buyerPays = parseFloat((listing.amount * listing.price).toFixed(4));
    if ((buyer.coins[listing.toCoin] || 0) < buyerPays) {
      return res.status(400).json({ ok: false, error: `Insufficient ${listing.toCoin} balance. Need ${buyerPays}` });
    }

    // Mark listing as accepted
    await database.collection(COL_P2P).updateOne(
      { _id: listingId },
      { $set: { status: 'accepted', buyerId: new ObjectId(req.userId), acceptedAt: new Date() } }
    );

    // Transfer: buyer pays toCoin → seller gets toCoin; seller's fromCoin → buyer gets fromCoin
    // Seller gets: buyerPays of toCoin
    await database.collection(COL_USERS).updateOne(
      { _id: listing.sellerId },
      { $inc: { [`coins.${listing.toCoin}`]: buyerPays } }
    );
    // Buyer pays toCoin, receives fromCoin (already deducted from seller when listing created)
    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $inc: { [`coins.${listing.toCoin}`]: -buyerPays, [`coins.${listing.fromCoin}`]: listing.amount } }
    );

    res.json({ ok: true, message: `Exchange successful! You received ${listing.amount} ${listing.fromCoin}` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/p2p/cancel/:id
router.post('/p2p/cancel/:id', requireAuth, async (req, res) => {
  try {
    const database = await getDb();
    let listingId;
    try { listingId = new ObjectId(req.params.id); } catch { return res.status(400).json({ ok: false, error: 'Invalid listing ID' }); }

    const listing = await database.collection(COL_P2P).findOne({ _id: listingId, status: 'open' });
    if (!listing) return res.status(404).json({ ok: false, error: 'Listing not found' });
    if (listing.sellerId.toString() !== req.userId) {
      return res.status(403).json({ ok: false, error: 'You can only cancel your own listings' });
    }

    await database.collection(COL_P2P).updateOne({ _id: listingId }, { $set: { status: 'cancelled' } });
    // Refund locked coins
    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $inc: { [`coins.${listing.fromCoin}`]: listing.amount } }
    );
    res.json({ ok: true, message: `Listing cancelled. ${listing.amount} ${listing.fromCoin} refunded.` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/trading/p2p/my
router.get('/p2p/my', requireAuth, async (req, res) => {
  try {
    const database = await getDb();
    const listings = await database.collection(COL_P2P)
      .find({ sellerId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    res.json({ ok: true, listings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DIRECT EXCHANGE
// ─────────────────────────────────────────────────────────────

// POST /api/trading/exchange
router.post('/exchange', requireAuth, async (req, res) => {
  try {
    const { fromCoin, toCoin, amount } = req.body;
    if (!ALL_COINS.includes(fromCoin) || !ALL_COINS.includes(toCoin)) {
      return res.status(400).json({ ok: false, error: 'Invalid coin' });
    }
    if (fromCoin === toCoin) return res.status(400).json({ ok: false, error: 'Cannot exchange same coin' });
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return res.status(400).json({ ok: false, error: 'Invalid amount' });

    const database = await getDb();
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    if ((user.coins[fromCoin] || 0) < qty) {
      return res.status(400).json({ ok: false, error: `Insufficient ${fromCoin} balance` });
    }

    // Calculate exchange rate via NENO as intermediate
    const getNenoPrice = (coin) => coin === 'NENO' ? 1 : marketPrices[coin].price;
    const fromPrice = getNenoPrice(fromCoin);
    const toPrice = getNenoPrice(toCoin);
    const nenoValue = qty * fromPrice;
    const received = parseFloat((nenoValue / toPrice).toFixed(4));

    // Apply 1% exchange fee
    const fee = parseFloat((received * 0.01).toFixed(4));
    const finalReceived = parseFloat((received - fee).toFixed(4));

    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $inc: { [`coins.${fromCoin}`]: -qty, [`coins.${toCoin}`]: finalReceived } }
    );

    const updatedUser = await getUserById(req.userId);
    res.json({
      ok: true,
      message: `Swapped ${qty} ${fromCoin} → ${finalReceived} ${toCoin} (1% fee applied)`,
      received: finalReceived,
      fee,
      coins: updatedUser.coins
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// TOOL SHOP ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/trading/tools
router.get('/tools', async (req, res) => {
  try {
    const toolsPath = path.join(__dirname, 'tools.json');
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    // Don't expose dl_link to unauthenticated users
    const publicTools = tools.map(t => ({
      id: t.id,
      name: t.name,
      short_caption: t.short_caption,
      long_caption: t.long_caption,
      price: t.price,
      icon: t.icon,
      category: t.category
    }));
    res.json({ ok: true, tools: publicTools });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/trading/tools/buy/:id
router.post('/tools/buy/:id', requireAuth, async (req, res) => {
  try {
    const toolId = req.params.id;
    const toolsPath = path.join(__dirname, 'tools.json');
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return res.status(404).json({ ok: false, error: 'Tool not found' });

    const database = await getDb();

    // Check already purchased
    const existing = await database.collection(COL_PURCHASES).findOne({
      userId: new ObjectId(req.userId),
      toolId
    });
    if (existing) {
      return res.json({ ok: true, dlLink: tool.dl_link, message: 'Already purchased!' });
    }

    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    if (user.coins.NENO < tool.price) {
      return res.status(400).json({ ok: false, error: `Insufficient NENO coins. Need ${tool.price}, have ${user.coins.NENO}` });
    }

    // Deduct coins
    await database.collection(COL_USERS).updateOne(
      { _id: new ObjectId(req.userId) },
      { $inc: { 'coins.NENO': -tool.price } }
    );

    // Record purchase
    await database.collection(COL_PURCHASES).insertOne({
      userId: new ObjectId(req.userId),
      toolId,
      toolName: tool.name,
      price: tool.price,
      purchasedAt: new Date()
    });

    res.json({ ok: true, dlLink: tool.dl_link, message: `${tool.name} purchased successfully!` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/trading/tools/purchased
router.get('/tools/purchased', requireAuth, async (req, res) => {
  try {
    const database = await getDb();
    const purchases = await database.collection(COL_PURCHASES)
      .find({ userId: new ObjectId(req.userId) })
      .sort({ purchasedAt: -1 })
      .toArray();

    // Add dl_links
    const toolsPath = path.join(__dirname, 'tools.json');
    const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    const enriched = purchases.map(p => {
      const tool = tools.find(t => t.id === p.toolId);
      return { ...p, dlLink: tool ? tool.dl_link : null };
    });

    res.json({ ok: true, purchases: enriched });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = router;

