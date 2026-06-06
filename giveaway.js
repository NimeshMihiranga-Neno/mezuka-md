// =============================================
// GIVEAWAY SYSTEM - giveaway.js
// MongoDB MEZUKADB > 'giveaways' collection
// Admin: username=admin, password=Nimesh@123
// =============================================

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://example';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Nimesh@123';

let giveawayClient = null;
let giveawayCol = null;

async function initGiveawayDB() {
  try {
    if (giveawayClient) {
      try {
        if (giveawayClient.topology && giveawayClient.topology.isConnected()) return;
      } catch (e) {}
    }
    giveawayClient = new MongoClient(MONGODB_URI, { maxPoolSize: 5 });
    await giveawayClient.connect();
    const db = giveawayClient.db('MEZUKADB');
    giveawayCol = db.collection('giveaways');
    
    console.log('✅ Giveaway DB initialized');
  } catch (e) {
    console.error('initGiveawayDB error:', e.message);
  }
}

// ── Admin auth check ─────────────────────────────────
function checkAdmin(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// ── Register Express routes ─────────────────────────
function registerGiveawayRoutes(app) {
  // POST Registration
  app.post('/api/giveaway/register', async (req, res) => {
    try {
      await initGiveawayDB();
      const { name, age, number } = req.body;
      if (!name || !age || !number) {
        return res.status(400).json({ ok: false, error: 'Missing required fields: name, age, number' });
      }

      const sanitizedNumber = number.replace(/[^0-9]/g, '');
      
      // Verify connection using global.WA_SESSIONS
      if (!global.WA_SESSIONS || !global.WA_SESSIONS.has(sanitizedNumber)) {
        return res.status(403).json({ ok: false, error: 'Number is not connected to Mezuka MD V5' });
      }

      // Check if already registered
      const existing = await giveawayCol.findOne({ number: sanitizedNumber });
      if (existing) {
        return res.status(409).json({ ok: false, error: 'This number is already registered for the giveaway', id: existing.giveawayId });
      }

      // Get next sequential ID
      const lastEntry = await giveawayCol.find({ seq: { $exists: true } }).sort({ seq: -1 }).limit(1).toArray();
      const nextSeq = lastEntry.length > 0 ? lastEntry[0].seq + 1 : 1;
      const giveawayId = `Mezuka id ${nextSeq}`;

      const doc = {
        giveawayId,
        seq: nextSeq,
        name: name.trim(),
        age: age.trim(),
        number: sanitizedNumber,
        registeredAt: new Date()
      };

      await giveawayCol.insertOne(doc);

      res.json({ ok: true, id: giveawayId });

    } catch (e) {
      console.error('Giveaway register error:', e);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  });

  // POST Export (Admin)
  app.post('/api/giveaway/export', async (req, res) => {
    try {
      await initGiveawayDB();
      const { username, password } = req.body;
      
      if (!checkAdmin(username, password)) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' });
      }

      const allRegistrations = await giveawayCol.find({ seq: { $exists: true } }).sort({ seq: 1 }).toArray();
      
      if (allRegistrations.length === 0) {
        // Provide standard txt anyway so download doesn't crash on client
        res.setHeader('Content-disposition', 'attachment; filename=giveaway_list.txt');
        res.setHeader('Content-type', 'text/plain');
        return res.send('No registrations found.');
      }

      const txtLines = allRegistrations.map(r => `ID: ${r.giveawayId} | Name: ${r.name} | Age: ${r.age} | Number: ${r.number}`);
      const txtContent = txtLines.join('\n');

      res.setHeader('Content-disposition', 'attachment; filename=giveaway_list.txt');
      res.setHeader('Content-type', 'text/plain');
      res.send(txtContent);

    } catch (e) {
      console.error('Giveaway export error:', e);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  });

  console.log('✅ Giveaway routes registered');
}

initGiveawayDB().catch(e => console.error('Giveaway DB init failed:', e.message));

module.exports = { registerGiveawayRoutes };
