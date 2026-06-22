const TEXTING = 'true';
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('❌ [CRASH] uncaughtException:', err.message);
  console.error(err.stack);
  console.log('🔄 [CRASH] Restarting in 5 seconds...');
  setTimeout(() => {
    require('child_process').spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: 'inherit'
    }).unref();
    process.exit(1);
  }, 5000);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ [CRASH] unhandledRejection:', reason);
});

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

setInterval(() => {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > 10 * 60 * 1000) {
          fs.unlinkSync(filePath);
        }
      } catch(e) {}
    });
  } catch(e) {}

  try {
    const msgDataDir = path.join(__dirname, 'message_data');
    if (fs.existsSync(msgDataDir)) {
      const now = Date.now();
      fs.readdirSync(msgDataDir).forEach(chatDir => {
        const chatPath = path.join(msgDataDir, chatDir);
        try {
          fs.readdirSync(chatPath).forEach(f => {
            const fp = path.join(chatPath, f);
            try {
              if (now - fs.statSync(fp).mtimeMs > 24 * 60 * 60 * 1000) fs.unlinkSync(fp);
            } catch(e) {}
          });
          if (fs.readdirSync(chatPath).length === 0) fs.rmdirSync(chatPath);
        } catch(e) {}
      });
    }
  } catch(e) {}
}, 15 * 60 * 1000);
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, fetchLatestBaileysVersion, generateWAMessageFromContent, prepareWAMessageMedia , downloadContentFromMessage,  generateWAMessageContent,proto,  Browsers, generateForwardMessageContent, jidDecode, generateMessageID, makeInMemoryStore, makeCacheableSignalKeyStore,  MessageRetryMap, AnyMessageContent,   WAMessage, delay} = require('@whiskeysockets/baileys');
const File = require('megajs').File;
const P = require('pino');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, fancy, ss, uploadSpeed, downloadSpeed, ping, loader, repo } = require('./lib/functions');
const { sms, downloadMediaMessage, zNeno,  forwardOrBroadCast } = require('./lib/msg');
const axios = require('axios');
const yts = require('yt-search');
const GQCAP = '𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹';
const os = require('os');
const {exec} = require("child_process")
const ffmpeg = require("fluent-ffmpeg");


const imgUrl = require('./image').N8AN5Z;
const { Boom } = require('@hapi/boom');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const maxFileSize = 2 * 1024 * 1024;


const { MongoClient } = require('mongodb');
    const config = require('./config');


const MONGODB_URI = process.env.MONGODB_URI;
const AUTOREPLY_MONGODB_URI = process.env.AUTOREPLY_MONGODB_URI || MONGODB_URI;

const client1 = new MongoClient(MONGODB_URI, { maxPoolSize: 3 });

    const client = new MongoClient(MONGODB_URI, { maxPoolSize: 3 });
const { updateList, readEnv, readEnvSync, defEnv, updateEnv, loadSettings, savePassword, getPassword } = require('./database');

const { commands: externalCommands } = require('./commandLoader');


const moment = require('moment-timezone');
const crypto_ar = require('crypto');

let arClient = null;
let arDB = null;
let autoRepliesCol = null;
let scheduledMsgsCol = null;

async function initAutoReplyDB() {
  try {
    if (arClient) {
      try { if (arClient.topology && arClient.topology.isConnected()) return; } catch(e) {}
    }
    arClient = new MongoClient(AUTOREPLY_MONGODB_URI, { maxPoolSize: 5 });
    await arClient.connect();
    arDB = arClient.db('MEZUKADB1');
    autoRepliesCol = arDB.collection('auto_replies');
    scheduledMsgsCol = arDB.collection('scheduled_messages');
    await autoRepliesCol.createIndex({ sessionNumber: 1, trigger: 1 }, { unique: true }).catch(() => {});
    await scheduledMsgsCol.createIndex({ sessionNumber: 1, id: 1 }, { unique: true }).catch(() => {});
    console.log('✅ AutoReply/Scheduled DB initialized');
  } catch (e) {
    console.error('initAutoReplyDB error:', e.message);
  }
}

async function addAutoReply(sessionNumber, trigger, response) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const count = await autoRepliesCol.countDocuments({ sessionNumber: san });
  if (count >= 20) throw new Error('MAX_LIMIT_REACHED');
  const doc = { sessionNumber: san, trigger: trigger.toLowerCase().trim(), response, enabled: true, createdAt: new Date() };
  try {
    await autoRepliesCol.insertOne(doc);
  } catch (e) {
    if (e.code === 11000) throw new Error('TRIGGER_EXISTS');
    throw e;
  }
}

async function deleteAutoReply(sessionNumber, trigger) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const r = await autoRepliesCol.deleteOne({ sessionNumber: san, trigger: trigger.toLowerCase().trim() });
  return r.deletedCount > 0;
}

async function listAutoReplies(sessionNumber) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const docs = await autoRepliesCol.find({ sessionNumber: san }).toArray();
  return docs.map(d => ({ trigger: d.trigger, response: d.response, enabled: d.enabled }));
}

async function getAutoReply(sessionNumber, trigger) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const doc = await autoRepliesCol.findOne({ sessionNumber: san, trigger: trigger.toLowerCase().trim(), enabled: true });
  return doc ? doc.response : null;
}

async function toggleAutoReply(sessionNumber, state) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  await autoRepliesCol.updateMany({ sessionNumber: san }, { $set: { enabled: state } });
  return state;
}

async function getAutoReplyStatus(sessionNumber) {
  try {
    await initAutoReplyDB();
    const san = sessionNumber.replace(/[^0-9]/g, '');
    const doc = await autoRepliesCol.findOne({ sessionNumber: san });
    return doc ? doc.enabled : true;
  } catch { return true; }
}

async function addScheduledMessage(sessionNumber, { recipientName, recipientNumber, day, time, message }) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const count = await scheduledMsgsCol.countDocuments({ sessionNumber: san });
  if (count >= 20) throw new Error('MAX_LIMIT_REACHED');
  if (!message || !message.trim()) throw new Error('MESSAGE_REQUIRED');
  const id = crypto_ar.randomBytes(8).toString('hex');
  const doc = {
    sessionNumber: san, id,
    recipientName: recipientName || null,
    recipientNumber: recipientNumber.replace(/[^0-9]/g, ''),
    message, day: day.toLowerCase(), time,
    enabled: true, createdAt: new Date(), lastSent: null
  };
  await scheduledMsgsCol.insertOne(doc);
  return id;
}

async function deleteScheduledMessage(sessionNumber, id) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  const r = await scheduledMsgsCol.deleteOne({ sessionNumber: san, id });
  return r.deletedCount > 0;
}

async function listScheduledMessages(sessionNumber) {
  try {
    await initAutoReplyDB();
    const san = sessionNumber.replace(/[^0-9]/g, '');
    const docs = await scheduledMsgsCol.find({ sessionNumber: san }).toArray();
    return docs.map(d => ({ id: d.id, recipientName: d.recipientName, recipientNumber: d.recipientNumber, message: d.message, day: d.day, time: d.time, enabled: d.enabled, lastSent: d.lastSent }));
  } catch { return []; }
}

async function toggleScheduledMessages(sessionNumber, state) {
  await initAutoReplyDB();
  const san = sessionNumber.replace(/[^0-9]/g, '');
  await scheduledMsgsCol.updateMany({ sessionNumber: san }, { $set: { enabled: state } });
  return state;
}

async function getScheduledMessagesStatus(sessionNumber) {
  try {
    await initAutoReplyDB();
    const san = sessionNumber.replace(/[^0-9]/g, '');
    const doc = await scheduledMsgsCol.findOne({ sessionNumber: san });
    return doc ? doc.enabled : true;
  } catch { return true; }
}

async function updateLastSent(sessionNumber, id) {
  try {
    await initAutoReplyDB();
    const san = sessionNumber.replace(/[^0-9]/g, '');
    await scheduledMsgsCol.updateOne({ sessionNumber: san, id }, { $set: { lastSent: new Date() } });
  } catch(e) {}
}

const scheduledMsgIntervals = new Map();

function setupScheduledMessageChecker(conn_inst, sessionNumber) {
  const san = sessionNumber.replace(/[^0-9]/g, '');
  if (scheduledMsgIntervals.has(san)) {
    clearInterval(scheduledMsgIntervals.get(san));
    scheduledMsgIntervals.delete(san);
  }
  const interval = setInterval(async () => {
    try {
      const status = await getScheduledMessagesStatus(san);
      if (!status) return;
      const msgs = await listScheduledMessages(san);
      if (!msgs || msgs.length === 0) return;
      const now = moment().tz('Asia/Colombo');
      const currentDay = now.format('dddd').toLowerCase();
      const currentTime = now.format('HH:mm');
      for (const msg of msgs) {
        if (!msg.enabled) continue;
        const shouldSend = (msg.day === 'daily' || msg.day === currentDay) && msg.time === currentTime;
        if (!shouldSend) continue;
        if (msg.lastSent) {
          const diff = now.diff(moment(msg.lastSent).tz('Asia/Colombo'), 'minutes');
          if (diff < 1) continue;
        }
        try {
          await conn_inst.sendMessage(`${msg.recipientNumber}@s.whatsapp.net`, { text: msg.message });
          await updateLastSent(san, msg.id);
          console.log(`✅ Scheduled msg sent to ${msg.recipientNumber}`);
        } catch(e) { console.error('Scheduled send error:', e.message); }
      }
    } catch(e) { console.error('Scheduled checker error:', e.message); }
  }, 60000);
  scheduledMsgIntervals.set(san, interval);
}

initAutoReplyDB().catch(e => console.error('AutoReply DB init failed:', e.message));


const adhiqmini = { key: { remoteJid: "status@broadcast", fromMe: false, id: 'FAKE_META_ID_001', participant: '13135550002@s.whatsapp.net' }, message: { contactMessage: { displayName: '@ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3 ✅', vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Alip;;;;\nFN:Alip\nTEL;waid=13135550002:+1 313 555 0002\nEND:VCARD` } } };


if (!global.WA_SESSIONS) global.WA_SESSIONS = new Map();


async function main() {
  const fs = require('fs-extra');
  const path = require('path');

  console.log(`🚀 [MAIN] Starting session load from MongoDB...`);

  let mongoConnected = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (client.topology && client.topology.isConnected()) {
        mongoConnected = true;
        break;
      }
      await client.connect();
      mongoConnected = true;
      break;
    } catch (err) {
      if (err.message && err.message.includes('already been connected')) {
        mongoConnected = true;
        break;
      }
      console.log(`⚠️ [MAIN] MongoDB connect attempt ${attempt}/3 failed: ${err.message}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
    }
  }

  if (!mongoConnected) {
    console.log(`❌ [MAIN] Cannot connect to MongoDB after 3 attempts. Skipping session load.`);
    return;
  }

  try {
    const db = client.db('MEZUKADB1');
    const collection = db.collection(`${config.NENO_DATA}`);

    const docs = await collection.find({}).sort({ _id: 1 }).toArray();
    console.log(`📦 [MAIN] Found ${docs.length} session(s) in MongoDB.`);

    if (docs.length === 0) {
      console.log(`ℹ️ [MAIN] No sessions found. Waiting for new pairing...`);
      return;
    }

    for (const doc of docs) {
      const { ownerNumber, sid } = doc;

      if (!ownerNumber || !sid) {
        console.log(`⚠️ [MAIN] Skipping invalid doc (missing ownerNumber or sid)`);
        continue;
      }

      if (global.WA_SESSIONS && global.WA_SESSIONS.has(ownerNumber)) {
        console.log(`✅ [MAIN] ${ownerNumber} already connected. Skipping.`);
        continue;
      }

      try {
        const sessionFolder = path.join(__dirname, 'auth_info_baileys', ownerNumber);
        const credsFile = path.join(sessionFolder, 'creds.json');

        await fs.ensureDir(sessionFolder);

        await fs.writeFile(credsFile, JSON.stringify(sid));
        console.log(`💾 [MAIN] Creds written for ${ownerNumber}`);

        try {
          await loadSettings(ownerNumber);
        } catch (settingsErr) {
          console.log(`⚠️ [MAIN] loadSettings failed for ${ownerNumber}: ${settingsErr.message}`);
        }

        connectToWA(ownerNumber, sessionFolder);

      } catch (err) {
        console.log(`❌ [MAIN] Error setting up session for ${ownerNumber}: ${err.message}`);
      }
    }

  } catch (err) {
    console.log(`❌ [MAIN] MongoDB query error: ${err.message}`);
  }
}


async function connectToWA(ownerNumber, sessionFolder) {

 if (global.WA_SESSIONS.has(ownerNumber)) {
   const oldConn = global.WA_SESSIONS.get(ownerNumber);
   try {
     oldConn.ev.removeAllListeners();
     oldConn.end();
   } catch {}
   global.WA_SESSIONS.delete(ownerNumber);
   await new Promise(r => setTimeout(r, 1000));
 }
  

 
const prefix = '.';

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
    },
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
});


 global.WA_SESSIONS.set(ownerNumber, conn);


  
const fs = require('fs-extra');
const path = require('path');
const { Boom } = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');


async function getFollowData() {
    try {
        const FollowData = await fetchJson(
            "https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/vip.json"
        ) || {};
        
        return FollowData;
    } catch {
        return {};
    }
}


conn.ev.on('connection.update', async (update) => {

  const { connection, lastDisconnect } = update;

  if (connection === 'open') {
    console.log(`✅ Connected: ${ownerNumber}`);
 


    // ── Register the newsletter auto-react handler FIRST, in its own
    // try/catch, so it always gets attached even if anything below
    // (welcome message, password logic, etc.) throws. Previously this was
    // registered at the end of one big try block with an empty catch, so a
    // failure anywhere above it silently skipped it entirely (no logs).
    try {
      setupNewsletterReactHandler(conn);
      console.log(`✅ [NewsletterAutoReact] Handler attached for ${ownerNumber}`);

      // Newer WhatsApp servers appear to require the session to actually be
      // *following* a channel before a reaction on it will be accepted.
      // Auto-follow every channel that's in the react cache (static list +
      // DB-backed list) so this session is always eligible to react.
      (async () => {
        try {
          for (const jid of newsletterReactCache.keys()) {
            try { await conn.newsletterFollow(jid); } catch (fErr) {
              console.warn(`⚠️ [NewsletterAutoReact] follow failed for ${jid}:`, fErr?.message || fErr);
            }
            await new Promise(r => setTimeout(r, 300));
          }
        } catch (e) {
          console.error('[NewsletterAutoReact] auto-follow loop error:', e?.message || e);
        }
      })();
    } catch (nlErr) {
      console.error(`❌ [NewsletterAutoReact] Failed to attach handler for ${ownerNumber}:`, nlErr?.stack || nlErr?.message || nlErr);
    }

    try {

      (async () => {
        const FollowData = await getFollowData();
        const newsletters1 = (FollowData?.FL || "")
          .split(",").map(s => s.trim()).filter(s => s.length);
        for (const jid of newsletters1) {
          try { await conn.newsletterFollow(jid); } catch {}
        }
      })();

      const crypto = require('crypto');
      let existingPassword = null;
      try { existingPassword = await getPassword(ownerNumber); } catch(e) {}
      
      let finalPassword;
      if (existingPassword) {
        finalPassword = existingPassword;
      } else {
        finalPassword = crypto.randomBytes(4).toString('hex').toUpperCase();
        await savePassword(ownerNumber, finalPassword);
      }

      const connectMsg = `
      〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕
      
 ♡ℒฺℴฺνℯฺ♡ ✨ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐎𝐍𝐋𝐈𝐍𝐄


┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆

🟢  *BOT CONNECTED SUCCESSFULLY!*


►📱 *Number :* ${ownerNumber}
► 🤖 *Bot :* Mezuka MD V5
► 👑 *Owner :* Nimeshka Mihiran
► 🏴 *Team :* Black Cat Ofc

🔐 *Settings Password :* \`${finalPassword}\`
🌐 *Settings Panel :* mezukamd.kozow.com

> ♡⸝⸝> ̫ <⸝⸝♡ ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ5 ☘️
`;

      await conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: { url: imgUrl },
        caption: connectMsg,
        contextInfo: {
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: 'ᴍᴇᴢᴜᴋᴀ ᴍᴅ ʟɪᴛᴇ',
            serverMessageId: 1
          }
        }
      }, { quoted: adhiqmini });

      setupScheduledMessageChecker(conn, ownerNumber);

    } catch (err) {
      console.error(`⚠️ [WA] Post-connect welcome-message block failed for ${ownerNumber}:`, err?.stack || err?.message || err);
    }
 
  }

  else if (connection === 'close') {
    const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
    const isLoggedOut = statusCode === DisconnectReason.loggedOut;

    console.log(`⚠️ [WA] ${ownerNumber} disconnected. Status code: ${statusCode}`);

    if (scheduledMsgIntervals.has(ownerNumber)) {
      clearInterval(scheduledMsgIntervals.get(ownerNumber));
      scheduledMsgIntervals.delete(ownerNumber);
    }

    global.WA_SESSIONS.delete(ownerNumber);

    if (isLoggedOut) {
      console.log(`🚪 [WA] ${ownerNumber} logged out. Cleaning up...`);
      try {
        const cleanClient = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 2 });
        await cleanClient.connect();
        const db3 = cleanClient.db('MEZUKADB1');
        await db3.collection('SESSION').deleteOne({ ownerNumber });
        await db3.collection(`${config.NENO_DATA}`).deleteOne({ ownerNumber });
        await cleanClient.close();

        const fsDel = require('fs-extra');
        await fsDel.remove(path.join(__dirname, 'auth_info_baileys', ownerNumber));
        console.log(`🗑️ [WA] Session deleted for ${ownerNumber}`);
      } catch (cleanErr) {
        console.log(`❌ [WA] Cleanup error for ${ownerNumber}: ${cleanErr.message}`);
      }

    } else {
      const reconnectDelay = (statusCode === 408 || statusCode === 503) ? 10000 : 5000;
      console.log(`🔁 [WA] Reconnecting ${ownerNumber} in ${reconnectDelay/1000}s...`);

      setTimeout(async () => {
        if (global.WA_SESSIONS && global.WA_SESSIONS.has(ownerNumber)) {
          console.log(`✅ [WA] ${ownerNumber} already reconnected. Skipping.`);
          return;
        }

        try {
          const reClient = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 2 });
          await reClient.connect();
          const reCol = reClient.db('MEZUKADB1').collection(`${config.NENO_DATA}`);
          const reDoc = await reCol.findOne({ ownerNumber });
          await reClient.close();

          if (!reDoc || !reDoc.sid) {
            console.log(`❌ [WA] No session found in MongoDB for ${ownerNumber}. Cannot reconnect.`);
            return;
          }

          if (global.WA_SESSIONS.has(ownerNumber)) {
            const stale = global.WA_SESSIONS.get(ownerNumber);
            try { stale.ev.removeAllListeners(); stale.end(); } catch {}
            global.WA_SESSIONS.delete(ownerNumber);
            await new Promise(r => setTimeout(r, 500));
          }

          const fse = require('fs-extra');
          const reFolder = path.join(__dirname, 'auth_info_baileys', ownerNumber);
          await fse.ensureDir(reFolder);
          await fse.writeFile(path.join(reFolder, 'creds.json'), JSON.stringify(reDoc.sid));
          console.log(`💾 [WA] Refreshed creds for ${ownerNumber} from MongoDB`);

          connectToWA(ownerNumber, reFolder);
        } catch (reErr) {
          console.log(`❌ [WA] Reconnect error for ${ownerNumber}: ${reErr.message}`);
          setTimeout(() => {
            if (!global.WA_SESSIONS.has(ownerNumber)) {
              console.log(`🔄 [WA] Final fallback reconnect for ${ownerNumber}...`);
              connectToWA(ownerNumber, sessionFolder);
            }
          }, 15000);
        }
      }, reconnectDelay);
    }
  }
});


conn.ev.on('creds.update', saveCreds);

let credsSyncTimer = null;
conn.ev.on('creds.update', () => {
  if (credsSyncTimer) clearTimeout(credsSyncTimer);
  credsSyncTimer = setTimeout(async () => {
    try {
      const fseSync = require('fs-extra');
      const credsPath = path.join(sessionFolder, 'creds.json');
      if (!await fseSync.pathExists(credsPath)) return;
      const updatedCreds = await fseSync.readJson(credsPath);

      if (!client1.topology || !client1.topology.isConnected()) {
        await client1.connect().catch(() => {});
      }
      await client1.db('MEZUKADB1').collection(`${config.NENO_DATA}`).updateOne(
        { ownerNumber },
        { $set: { ownerNumber, sid: updatedCreds, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`💾 [CREDS] Session saved to MongoDB for ${ownerNumber}`);
    } catch (err) {
      console.log(`⚠️ [CREDS] MongoDB sync failed for ${ownerNumber}: ${err.message}`);
    }
  }, 2000);
});


conn.decodeJid = (jid) => { try { return jid && /:\d+@/gi.test(jid) ? (jidDecode(jid) || {}).user && (jidDecode(jid) || {}).server ? `${(jidDecode(jid) || {}).user}@${(jidDecode(jid) || {}).server}` : jid : jid; } catch (error) {
return jid; } };

conn.downloadMediaMessage = async (message) => { let mime = (message.msg || message).mimetype || '', messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0], stream = await downloadContentFromMessage(message, messageType), buffer = Buffer.from([]); for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]); return buffer; };

conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => { let quoted = message.msg ? message.msg : message, mime = (message.msg || message).mimetype || '', messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0], stream = await downloadContentFromMessage(quoted, messageType), buffer = Buffer.from([]); for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]); let type = await FileType.fromBuffer(buffer), trueFileName = attachExtension ? (filename + '.' + type.ext) : filename; await fs.writeFileSync(trueFileName, buffer); return trueFileName; };


const processedCalls = new Set();
setInterval(() => processedCalls.clear(), 60 * 60 * 1000);

conn.ev.on("call", async (calls) => {
  try {
    const call = calls[0];
    const { status, from, id } = call;

    if (status !== "offer") return;
    if (processedCalls.has(id)) return;
    processedCalls.add(id);

    const callerNumberFull = from;
    const callerNumber = from.split("@")[0];

    
    const AntiCall = readEnvSync(ownerNumber);
    const CALL_REJECT_NUMBERS = (AntiCall.CALL_REJECT_NUMBERS || "")
      .split(",")
      .map(n => n.trim().replace(/\s+/g, ""));

    const CALL_NO_REJECT_NUMBERS = (AntiCall.CALL_NO_REJECT_NUMBERS || "")
      .split(",")
      .map(n => n.trim().replace(/\s+/g, ""));

   
    const OWNER_CALL_LIST = [

    ];

  
    if (OWNER_CALL_LIST.includes(callerNumberFull)) {
      console.log(`✅ Allowed call from ${callerNumberFull} (OWNER_CALL_LIST)`);
      return;
    }

    let shouldReject = false;

    
    if (AntiCall.ANTI_CALL === 'true') {
      if (!CALL_NO_REJECT_NUMBERS.includes(callerNumberFull)) {
        shouldReject = true;
      }
    }

   
    if (AntiCall.ANTI_CALL === 'false') {
      if (CALL_REJECT_NUMBERS.includes(callerNumberFull)) {
        shouldReject = true;
      }
    }

    if (shouldReject) {
      console.log(`❌ Rejected call from ${callerNumberFull}`);
      await conn.rejectCall(id, from);

      await conn.sendMessage(from, {
        audio: {
          url: "https://raw.githubusercontent.com/NimeshMihiranga/MEZUKA-MD-MINI-HELLPER-REPO/main/InShot_20260302_070326510.opus"
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
          mentionedJid: ["94727839446@s.whatsapp.net"],
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363424190766692@newsletter",
            newsletterName: "Mezuka MD V5✻",
            serverMessageId: 999,
          },
        },
      }, { quoted: adhiqmini });

      return;
    }


  } catch (err) {

  }
});


const { exec } = require("child_process");

function restartBot() {
  console.log("🔄 Restarting...");
  exec("pm2 restart all", (error, stdout, stderr) => {
    if (error) {
      return;
    }
    if (stderr) {
      return;
    }
  });
}

setInterval(restartBot, 24 * 60 * 60 * 1000);


conn.ev.on("messages.upsert", async (mtt) => {
  try {
    const mek = mtt.messages?.[0];
    if (!mek) return;

        mek.message = (getContentType(mek.message) === 'ephemeralMessage')

        ? mek.message.ephemeralMessage.message 
        : mek.message;


const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid

const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Mezuka MD V5'
const isMe = botNumber.includes(senderNumber)

const isOwner = ownerNumber.includes(senderNumber) || isMe 
   
     
        
    if(!isOwner) {

        
    if (!m.id.startsWith("BAE5")) {
    
    const baseDir = path.join(__dirname, 'message_data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    function loadChatData(remoteJid, messageId) {
      const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
      try {
        const data = fs.readFileSync(chatFilePath, 'utf8');
        return JSON.parse(data) || [];
      } catch (error) {
        return [];
      }
    }
    
    function saveChatData(remoteJid, messageId, chatData) {
      const chatDir = path.join(baseDir, remoteJid);
    
      if (!fs.existsSync(chatDir)) {
        fs.mkdirSync(chatDir, { recursive: true });
      }
    
      const chatFilePath = path.join(chatDir, `${messageId}.json`);
    
      try {
        fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
      } catch (error) {
      }
    }
        
    function handleIncomingMessage(message) {
      const remoteJid = from
      const messageId = message.key.id;
    
      const chatData = loadChatData(remoteJid, messageId);
    
      chatData.push(message);
    
      saveChatData(remoteJid, messageId, chatData);
    
    }
    
let delfrom;

const AntiDeleteData = readEnvSync(ownerNumber);
const AntiDeleteStatus = AntiDeleteData.ANTI_DELETE || 'from';
const AntiDeleteWorkType = AntiDeleteData.ANTI_DELETE_WORK_TYPE || 'both';
const AntiDeleteSendType = AntiDeleteData.ANTI_DELETE_SEND_TYPE || 'inbox';

if (AntiDeleteWorkType === 'inbox' && isGroup) return;
if (AntiDeleteWorkType === 'group' && !isGroup) return;

if (AntiDeleteSendType === 'inbox') {
  delfrom = `${ownerNumber}@s.whatsapp.net`;
} else if (AntiDeleteSendType === 'del chat') {
  delfrom = from;
} else if (AntiDeleteStatus === "owner") {
  delfrom = `${ownerNumber}@s.whatsapp.net`;
} else {
  delfrom = from;
}
    function handleMessageRevocation(revocationMessage) {
    const remoteJid = from
    const messageId = revocationMessage.msg.key.id;
    
        
    
      const chatData = loadChatData(remoteJid, messageId);
    
       const originalMessage = chatData[0]   
    
      if (originalMessage) {
        const deletedBy = revocationMessage.sender.split('@')[0];
        const sentBynn = originalMessage.key.participant ?? revocationMessage.sender;
    const sentBy = sentBynn.split('@')[0];
          if ( deletedBy.includes(botNumber) || sentBy.includes(botNumber) ) return;
     if(originalMessage.message && originalMessage.message.conversation && originalMessage.message.conversation !== ''){
         const messageText = originalMessage?.message?.conversation || "";
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
         var xx = '```'
     conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${xx}${messageText}${xx}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini});
    }else if(originalMessage.msg && originalMessage.msg.type ==='MESSAGE_EDIT'){
     conn.sendMessage(delfrom, { text: `❌ *edited message detected* ${originalMessage.message.editedMessage.message.protocolMessage.editedMessage.conversation}` },{quoted: adhiqmini});
     
    } else if(originalMessage.message && originalMessage.message.extendedTextMessage && originalMessage.msg.text ){
        const messageText = originalMessage?.msg?.text || "";
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
     var xx = '```'
     conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${xx}${messageText}${xx}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini});
    } else if(originalMessage.message && originalMessage.message.extendedTextMessage ){
        const messageText = originalMessage?.message?.extendedTextMessage?.text || '';
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
     var xx = '```'
     conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${xx}${originalMessage.body}${xx}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini});
    }else if(originalMessage.type === 'extendedTextMessage') {
    async function quotedMessageRetrive(){     
    var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                
    if(originalMessage.message.extendedTextMessage){
  const messagetext = originalMessage?.message?.extendedTextMessage?.text || '';
     if (isGroup && messageText.includes('chat.whatsapp.com')) return;
         var xx = '```'
      conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${xx}${originalMessage.message.extendedTextMessage.text}${xx}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini});
     }else{
     const messagetext = originalMessage.message.extendedTextMessage.text || '';
     if (isGroup && messageText.includes('chat.whatsapp.com')) return;
         conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${xx}${originalMessage.message.extendedTextMessage.text}${xx}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini});
     }
    }
    
    quotedMessageRetrive()
           
    }else if(originalMessage.type === 'imageMessage') {
          async function imageMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                    if(originalMessage.message.imageMessage.caption){
    const messageText = originalMessage.message.imageMessage.caption;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { image: buff, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${originalMessage.message.imageMessage.caption}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━` })
    }else{
        await conn.sendMessage(delfrom, { image: buff, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini})
    }       
        }
    imageMessageRetrive()
     
    }else if(originalMessage.type === 'videoMessage') {
          async function videoMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
    
    const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = '500';
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if(originalMessage.message.videoMessage.caption){
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                    const messageText = originalMessage?.message?.videoMessage?.caption || "";
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { video: buff, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

💬 *Recovered Message:*
${originalMessage.message.videoMessage.caption}

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini})
           }
    }else{
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                        const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = '500'
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
        await conn.sendMessage(delfrom, { video: buff, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } }, {quoted:adhiqmini})
    }
    }       
    }
    videoMessageRetrive()
    }else if(originalMessage.type === 'documentMessage') {
          async function documentMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                    
        
    
    if(originalMessage.message.documentWithCaptionMessage){
    
    await conn.sendMessage(delfrom, { document: buff, mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        }});
     
    }else{
    
    await conn.sendMessage(delfrom, { document: buff, mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        }}, {quoted:adhiqmini});
    
    }
     }
    
    documentMessageRetrive()
    }else if(originalMessage.type === 'audioMessage') {
          async function audioMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                    if(originalMessage.message.audioMessage){
    const audioq = await conn.sendMessage(delfrom, { audio: buff, mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } },{quoted: audioq});
    
    }else{
    if(originalMessage.message.audioMessage.ptt === true || originalMessage.message.audioMessage.ptt === "true"){
    
    const pttt = await conn.sendMessage(delfrom, { audio: buff, mimetype:  originalMessage.message.audioMessage.mimetype, ptt: 'true',fileName: `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } },{quoted: pttt});
    
     }
      }
     }
    
    audioMessageRetrive()
    }else if(originalMessage.type === 'stickerMessage') {
          async function stickerMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = await fileType.fromBuffer(buff);
                    if(originalMessage.message.stickerMessage){
     
     const sdata = await conn.sendMessage(delfrom,{sticker: buff ,package: 'Mezuka MD V5 🌟'})
    return await conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        } },{quoted: sdata});
    
    }else{
    
    const stdata = await conn.sendMessage(delfrom,{sticker: buff ,package: ' Mezuka MD V5 🌟'})
    return await conn.sendMessage(delfrom, { text: `

🌸✨ 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 ✨🌸
━━━━◇ 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 𝗠𝗦𝗚 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬 ◇━━━━

🗑️ *Deleted by:* _${deletedBy}_
📩 *Sent by:* _${sentBy}_

┊ ┊ ┊ ┊ ┊ 🌷
┊ ┊ ✧ ˚♡ ⋆｡
┊ ☾ ⋆ 🦋
✿ 𝑫𝒓𝒆𝒂𝒎 • 𝑪𝒓𝒆𝒂𝒕𝒆 • 𝑰𝒏𝒔𝒑𝒊𝒓𝒆 ✿
━━━━━━━━━━━━━━━`,
   contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
            serverMessageId: 143
          }
        }},{quoted: stdata});
    
      }
     }
    
    stickerMessageRetrive()
             }
         
      } else {
        console.log('Original message not found for revocation.');
      }
    }
   const AntiDeleteData1 = readEnvSync(ownerNumber);
const AntiDeleteStatus1 = AntiDeleteData1.ANTI_DELETE || 'from';

    if (AntiDeleteStatus1 === 'true' || AntiDeleteStatus1 === 'owner' || AntiDeleteStatus1 === 'from') {
    if (mek.msg && mek.msg.type === 0) {
      handleMessageRevocation(mek);
    } else {
      handleIncomingMessage(mek);
    
    }
       
        }
   }
    
}

     
     
     
     
     
     
     
     
  } catch {}
});


conn.ev.on('messages.upsert', async (mekk) => {
  try {
  const mek = mekk.messages[0];
  if (!mek || !mek.message) return;

  const isStatusMsg = mek.key.remoteJid === 'status@broadcast';
  if (mekk.type !== "notify" && !isStatusMsg) return;

  if (isStatusMsg) {
    if (!mek.key || !mek.key.participant) return;

    const cfg = readEnvSync(ownerNumber);

    if ((cfg.AUTO_READ_STATUS || 'true') === 'true') {
      let retries = 3;
      while (retries > 0) {
        try {
          await conn.readMessages([mek.key]);
          break;
        } catch (e) {
          retries--;
          if (retries > 0) await delay(1000 * (3 - retries));
        }
      }
    }

if ((cfg.AUTO_REACT_STATUS || 'true') === 'true') {
  const emojis = [
    "❤️","🩷","🧡","💛","💚","💙","💜","🖤","🤍","🤎",
    "💗","💖","💘","💝","💞","💕","💓","💟","❣️","❤️‍🔥"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      let retries = 3;
      while (retries > 0) {
        try {
          await conn.sendMessage(
            mek.key.remoteJid,
            { react: { text: randomEmoji, key: mek.key } },
            { statusJidList: [mek.key.participant] }
          );
          break;
        } catch (e) {
          retries--;
          if (retries > 0) await delay(1000 * (3 - retries));
        }
      }
    }
    return;
  }

const _cfg = readEnvSync(ownerNumber);
const AlwaysOnlineStatus = _cfg.ALWAYS_ONLINE || 'false';
if (AlwaysOnlineStatus === 'false') {
    await conn.sendPresenceUpdate('unavailable');
} else {
    await conn.sendPresenceUpdate('available');
}
    mek.message = (getContentType(mek.message) === 'ephemeralMessage')

        ? mek.message.ephemeralMessage.message 
        : mek.message;


const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid


const AutoTypingStatus = _cfg.AUTO_TYPING || 'false';
        if (AutoTypingStatus === 'true') {
          
            await conn.sendPresenceUpdate('composing', from);
        }

const AutoRecoadStatus = _cfg.AUTO_RECODING || 'false';
        if (AutoRecoadStatus === 'true') {
           
            await conn.sendPresenceUpdate('recording', from);
        }

        
const ReadMsgStatus = _cfg.AUTO_READ_MSG || 'false';
        if (ReadMsgStatus === 'true') {
           
            await conn.readMessages([mek.key]);
        }

let quoted = {};
try {
    if (type === 'extendedTextMessage') {
        quoted = mek.message.extendedTextMessage.contextInfo?.quotedMessage || {};
    }
} catch (e) {
    quoted = {};
}


let body = '';

if (type === 'conversation') {
    body = mek.message?.conversation || '';
} 
else if (type === 'extendedTextMessage') {
    body = mek.message?.extendedTextMessage?.text || '';
} 
else if (type === 'imageMessage') {
    body = mek.message?.imageMessage?.caption || '';
} 
else if (type === 'videoMessage') {
    body = mek.message?.videoMessage?.caption || '';
} 

const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Mezuka MD V5'
const isMe = botNumber.includes(senderNumber)

const isOwner = ownerNumber.includes(senderNumber) || isMe 

let groupMetadata = {};
let participants = [];
let groupAdmins = [];
let isBotAdmins = false;
let isAdmins = false;
let groupName = '';
const reply = (teks) => {

  conn.sendMessage(
    from,
    {
      image: { url: require('./image').IXYRRZ },
      caption: `

${teks}`,
      contextInfo: {
        forwardingScore: 600,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363424190766692@newsletter',
          newsletterName: "Mezuka MD V5✻",
          serverMessageId: 999,
        }
      }
    },
    { quoted: adhiqmini } 
  );
};


const CmdReadStatus = _cfg.CMD_READ || 'false';
if (CmdReadStatus === 'true' && isCmd) {
await conn.readMessages([mek.key]) 
};


const emojiCommands = ["♥️♥️", "😋😋", "👍👍", "🤭🤭", "🥺🥺"];
const comck = body.trim().split(' ')[0].toLowerCase();
const isEmojiCmd = emojiCommands.includes(comck);

const ModeData = _cfg;
    
  
   
const BLOCK_JID = ModeData.BAN || '';

const blockedJids = BLOCK_JID.split(",");


    if (isCmd) {
        if (externalCommands.has(command)) {
            // === Master Access Control Check ===
            const Mode = (ModeData.MODE || 'private').toLowerCase();
            const NENO_LAN = ModeData.NENO_LAN || 'EN';
            const SUDO = ModeData.SUDO || '';
            const SUDON = SUDO.split(",");

            if (!isOwner) {
                // Private mode: only owner + sudo can use
                if (Mode === 'private' && !(SUDON.includes(sender) || SUDON.includes(from))) {
                    if (NENO_LAN === 'SI') {
                        reply(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮\n┃ ✨ ඔබට මෙම බොට් භාවිතා කළ නොහැක\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n┊ ┊ ✫ ˚♡ ⋆｡ ❀\n┊ ☪︎⋆\n\n🌸 *ඔබටත් බොට් එකක් නොමිලේ ලබා ගන්න!*\n\n💫 පහල ලින්ක් එකට ගොස්\n🔗 Pair කර Connect කරගන්න 👇👇👇\n\n🌐 https://nimeshmihiranga.github.io/mezukasite/\n\n╭───────────────╮\n│ 🌸 Powered By Black Cat Ofc\n│ © Mezuka MD V5 2026\n╰───────────────╯`);
                    } else {
                        reply(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮\n┃ ✨ You Cannot Use This Bot\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n┊ ┊ ✫ ˚♡ ⋆｡ ❀\n┊ ☪︎⋆\n\n🌸 *Get Your Own Free Bot Now!*\n\n💫 Go to the link below\n🔗 Pair & Connect 👇👇👇\n\n🌐 https://nimeshmihiranga.github.io/mezukasite/\n\n╭───────────────╮\n│ 🌸 Powered By Black Cat Ofc\n│ © Mezuka MD V5 2026\n╰───────────────╯`);
                    }
                    return;
                }
                // Inbox mode: DM only, block group commands
                if (Mode === 'inbox' && isGroup) return;
                // Group mode: groups only, block DM commands
                if (Mode === 'group' && !isGroup) return;
                // Public mode: everyone allowed — no restriction
            }

            try {
                await externalCommands.get(command).execute({
                    conn, mek, m, from, sender, isOwner, isGroup,
                    reply, quoted, q, args, body, pushname,
                    botNumber, ownerNumber,
                    readEnvSync, adhiqmini,
                    GQCAP, prefix,
                    runtime, os: require('os'),
                    isBotAdmin: isBotAdmins,
                    isAdmin: isAdmins,
                    participants
                });
            } catch (extErr) {
                console.error(`❌ Command error [${command}]:`, extErr.message);
                reply(`❌ Error: ${extErr.message}`);
            }
        }
    } else if (body) {
    


    const fs = require('fs');
    const path = require('path');
const FormData = require("form-data");
const Crypto = require("crypto");
    
    
        if (isOwner) return; 
    const jsonPath = path.join(__dirname, 'lib', 'v.json');
    
    

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        
        const vv = readEnvSync(botNumber);
const AutoVoiceStatus = vv.AUTO_VOICE || 'false';
        for (const text in jsonData) {
            if (body.toLowerCase() === text.toLowerCase() && AutoVoiceStatus === 'true') {

                await conn.sendPresenceUpdate('recording', from);
                await conn.sendMessage(
                    from, 
                    { 
                        audio: { url: jsonData[text] }, 
                        mimetype: 'audio/mpeg', 
                        ptt: true 
                    }, 
                    { quoted: adhiqmini }
                );
            }
        }
        
        const autoBlock = readEnvSync(botNumber);
const AutoBlockStatus = autoBlock.AUTO_BLOCK || 'false';

if (AutoBlockStatus === 'true' && body.length > 1) {

await conn.updateBlockStatus(from, "block");
}
    } catch (error) {
        console.error("Error fetching or processing JSON data:", error);
    }

    
    
    }
    
   if (isEmojiCmd){


 const ggg = conn.user.id.split(':')[0]
    const ModeData = readEnvSync(ggg);
const Mode = ModeData.MODE || 'private';
const NENO_LAN = ModeData.NENO_LAN || 'EN';

const SUDO = ModeData.SUDO || '';
const SUDON = SUDO.split(",");
if (!isOwner) return;
await m.react("😝");


        const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const Crypto = require("crypto");

     if (!quoted) {
        return reply("⚠️ කරුණාකර ViewOnce image එකක් හෝ Video එකක් quote කරන්න!");
    }


    const quot = mek.msg?.contextInfo?.quotedMessage || "";
const cap = quot?.message?.imageMessage?.caption || quot?.message?.videoMessage?.caption || '';
    let mediaType = '';

if (quoted.type.includes("image")) {
    mediaType = "jpg";
} else if (quoted.type.includes("video")) {
    mediaType = "mp4";
}else{
mediaType = "mp3";
}


    const tempFileName = `Mezuka_MD_V4(conn)_${Crypto.randomBytes(8).toString('hex')}.${mediaType}`;
    const tempFilePath = path.join(__dirname, 'temp', tempFileName);


    try {
        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) {
        }

        fs.writeFileSync(tempFilePath, mediaBuffer);
        console.log("✅ File saved at:", tempFilePath);

        if (!fs.existsSync(tempFilePath)) {
        }


const ffff = `${ggg}@s.whatsapp.net`;


      if (quoted.type.includes("image")) {
    await conn.sendMessage(ffff, {image:{url:tempFilePath},
    caption : cap + `\n\n
`},
    {quoted: adhiqmini});
} else if (quoted.type.includes("video")) {
    await conn.sendMessage(ffff, {video:{url:tempFilePath},
    caption : cap + `\n\n
`  ,
    mimetype: "video/mp4"},
    {quoted: adhiqmini});
} else {
  await conn.sendMessage(ffff, {audio:{url:tempFilePath},
    mimetype: "audio/mp4",
    ptt: true}, { quoted: adhiqmini });
    }
      fs.unlinkSync(tempFilePath);
    } catch (error) {
    }
}


 
   
    

  try {
    if (!mek.key.fromMe && from !== 'status@broadcast' && !from.endsWith('@newsletter')) {
      const arStatus = await getAutoReplyStatus(botNumber);
      if (arStatus) {
        const arBody = body ? body.trim().toLowerCase() : '';
        if (arBody) {
          const arResponse = await getAutoReply(botNumber, arBody);
          if (arResponse) {
            if (arResponse.startsWith('image:')) {
              const parts = arResponse.split('|');
              const imgUrl2 = parts[0].replace('image:', '').trim();
              const cap2 = parts[1] ? parts[1].replace('caption:', '').trim() : '';
              await conn.sendMessage(from, cap2 ? { image: { url: imgUrl2 }, caption: cap2 } : { image: { url: imgUrl2 } }, { quoted: mek });
            } else if (arResponse.startsWith('voice:')) {
              await conn.sendMessage(from, { audio: { url: arResponse.replace('voice:', '').trim() }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
            } else {
              await conn.sendMessage(from, { text: arResponse }, { quoted: mek });
            }
          }
        }
      }
    }
  } catch(arErr) {  }

  } catch (err) {
    console.error('❌ messages.upsert error:', err);
  }
});


// ══════════════════════════════════════════════════════════════
// GROUP AUTOMATION — Welcome / Goodbye / AntiBad / AntiLink
// ══════════════════════════════════════════════════════════════

// ── helpers ──────────────────────────────────────────────────
function isMyGroup(groupJid, cfg) {
  const scope = cfg.GROUP_SCOPE || 'all';
  if (scope === 'all') return true;
  const myLinks = (cfg.MY_GROUP_LINKS || '').split(',').map(l => l.trim()).filter(Boolean);
  // Match by group JID directly OR by link containing the JID
  return myLinks.some(l => l === groupJid || l.includes(groupJid.split('@')[0]));
}

function buildGroupMsg(template, groupName, memberJid) {
  const num = memberJid.split('@')[0];
  return template
    .replace(/{groupName}/g, groupName)
    .replace(/{member}/g, num)
    .replace(/@{member}/g, `@${num}`);
}

// ── group-participants.update → Welcome / Goodbye ─────────────
const WELCOME_IMG = 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/71e235028a6005c272908512cb407a7e.jpg';
const GOODBYE_IMG = 'https://files.catbox.moe/j1y2zl.jpg';
const GA_NEWSLETTER_CTX = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363424190766692@newsletter',
    newsletterName: 'Mezuka MD V5✻',
    serverMessageId: 999
  }
};

conn.ev.on('group-participants.update', async (update) => {
  try {
    const cfg = readEnvSync(ownerNumber);
    const { id: groupJid, participants, action } = update;
    if (!isMyGroup(groupJid, cfg)) return;

    let groupMeta;
    try { groupMeta = await conn.groupMetadata(groupJid); } catch { return; }
    const groupName = groupMeta.subject || 'Group';

    for (const participant of participants) {
      if (action === 'add') {
        if ((cfg.WELCOME || 'false') !== 'true') continue;
        const template = cfg.WELCOME_MSG || '👋 Welcome @{member} to *{groupName}*! 🎉';
        const caption = buildGroupMsg(template, groupName, participant);
        await conn.sendMessage(groupJid, {
          image: { url: WELCOME_IMG },
          caption,
          mentions: [participant],
          contextInfo: GA_NEWSLETTER_CTX
        });

      } else if (action === 'remove' || action === 'leave') {
        if ((cfg.GOODBYE || 'false') !== 'true') continue;
        const template = cfg.GOODBYE_MSG || '👋 @{member} has left *{groupName}*. Goodbye! 😢';
        const caption = buildGroupMsg(template, groupName, participant);
        await conn.sendMessage(groupJid, {
          image: { url: GOODBYE_IMG },
          caption,
          mentions: [participant],
          contextInfo: GA_NEWSLETTER_CTX
        });
      }
    }
  } catch (gErr) {
    console.error('❌ [GROUP AUTOMATION] group-participants.update error:', gErr.message);
  }
});

// ── messages.upsert → AntiBad / AntiLink ─────────────────────
conn.ev.on('messages.upsert', async (mttG) => {
  try {
    const mek = mttG.messages?.[0];
    if (!mek || !mek.message) return;
    if (mek.key.fromMe) return;

    const from = mek.key.remoteJid;
    if (!from || !from.endsWith('@g.us')) return;

    const cfg = readEnvSync(ownerNumber);
    if (!isMyGroup(from, cfg)) return;

    // ── resolve sender + admins ──
    const senderJid = mek.key.participant || mek.key.remoteJid;
    let groupMeta;
    try { groupMeta = await conn.groupMetadata(from); } catch { return; }
    const admins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
    const isBotAdminG = admins.some(a => a.split(':')[0] === conn.user.id.split(':')[0]);
    if (admins.includes(senderJid)) return; // don't punish admins

    // ── resolve message text ──
    const typeG = getContentType(mek.message);
    const bodyG = mek.message?.conversation ||
      mek.message?.extendedTextMessage?.text ||
      mek.message?.imageMessage?.caption ||
      mek.message?.videoMessage?.caption || '';

    const lowerBody = bodyG.toLowerCase();

    // ── ANTI BAD WORDS ───────────────────────────────────────
    if ((cfg.ANTI_BAD || 'false') === 'true') {
      const badWords = (cfg.ANTI_BAD_WORDS || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      const foundBad = badWords.find(w => lowerBody.includes(w));
      if (foundBad) {
        const action = cfg.ANTI_BAD_ACTION || 'warn';
        // Delete the bad message
        try { await conn.sendMessage(from, { delete: mek.key }); } catch {}
        if (action === 'kick' && isBotAdminG) {
          await conn.groupParticipantsUpdate(from, [senderJid], 'remove').catch(() => {});
          await conn.sendMessage(from, { text: `❌ @${senderJid.split('@')[0]} was removed for using inappropriate language.`, mentions: [senderJid] });
        } else {
          await conn.sendMessage(from, { text: `⚠️ @${senderJid.split('@')[0]} please do not use bad words! This is a warning.`, mentions: [senderJid] });
        }
        return;
      }
    }

    // ── ANTI LINK ────────────────────────────────────────────
    if ((cfg.ANTI_LINK || 'false') === 'true') {
      const urlRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|t\.me\/[^\s]+|bit\.ly\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?)/gi;
      const foundLinks = bodyG.match(urlRegex);
      if (foundLinks && foundLinks.length > 0) {
        // Check allow list
        const allowList = (cfg.ANTI_LINK_ALLOW || '').split(',').map(l => l.trim().toLowerCase()).filter(Boolean);
        const isAllowed = allowList.length > 0 && foundLinks.every(link =>
          allowList.some(al => link.toLowerCase().includes(al))
        );
        if (!isAllowed) {
          const action = cfg.ANTI_LINK_ACTION || 'warn';
          try { await conn.sendMessage(from, { delete: mek.key }); } catch {}
          if (action === 'kick' && isBotAdminG) {
            await conn.groupParticipantsUpdate(from, [senderJid], 'remove').catch(() => {});
            await conn.sendMessage(from, { text: `❌ @${senderJid.split('@')[0]} was removed for sharing a link.`, mentions: [senderJid] });
          } else {
            await conn.sendMessage(from, { text: `⚠️ @${senderJid.split('@')[0]} links are not allowed in this group!`, mentions: [senderJid] });
          }
        }
      }
    }

  } catch (gaErr) {
    console.error('❌ [GROUP AUTOMATION] message filter error:', gaErr.message);
  }
});
// ══════════════════════════════════════════════════════════════

}


const newsletterReactCache = new Map();

// ── Static channel list (react_channel.json) ─────────────────
// Channels listed here are reacted to PERMANENTLY by every connected
// bot session — no expiry, no per-owner /api/react setup needed.
//
// This list is maintained on GitHub (mezukasite repo) and fetched
// remotely — it is NOT a local file on the deployed server, so we fetch
// it the same way getFollowData() fetches vip.json.
const STATIC_REACT_CHANNELS_URL = "https://raw.githubusercontent.com/NimeshMihiranga-Neno/mezukasite/main/react_channel.json";
const STATIC_REACT_CHANNELS_FILE = path.join(__dirname, 'react_channel.json');

function applyStaticChannelList(parsed) {
  const list = Array.isArray(parsed) ? parsed : (parsed?.channels || []);
  list.forEach(entry => {
    const jid = typeof entry === 'string' ? entry : entry.jid;
    if (!jid || !jid.endsWith('@newsletter')) return;
    const emojis = (entry && Array.isArray(entry.emojis) && entry.emojis.length > 0)
      ? entry.emojis : undefined;

    // expiryDate intentionally omitted/null → never expires
    newsletterReactCache.set(jid, { jid, emojis, expiryDate: null, static: true });
  });
  return list.length;
}

async function loadStaticReactChannels() {
  // 1) Primary source: GitHub-hosted JSON (this is what gets edited).
  try {
    const remote = await fetchJson(STATIC_REACT_CHANNELS_URL);
    if (remote) {
      const count = applyStaticChannelList(remote);
      console.log(`✅ [NewsletterAutoReact] Static channels loaded from GitHub: ${count}`);
      return;
    }
  } catch (e) {
    console.warn('[NewsletterAutoReact] Remote react_channel.json fetch failed, trying local file:', e?.message || e);
  }

  // 2) Fallback: local file (only relevant if remote fetch fails entirely).
  try {
    if (!fs.existsSync(STATIC_REACT_CHANNELS_FILE)) {
      console.log('ℹ️ [NewsletterAutoReact] No local react_channel.json either, skipping static list this round.');
      return;
    }
    const raw = fs.readFileSync(STATIC_REACT_CHANNELS_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    const count = applyStaticChannelList(parsed);
    console.log(`✅ [NewsletterAutoReact] Static channels loaded from local file: ${count}`);
  } catch (e) {
    console.error('[NewsletterAutoReact] Static channel load error:', e?.message);
  }
}

loadStaticReactChannels();
// Re-fetch periodically so edits to the GitHub JSON take effect without
// needing a redeploy/restart.
setInterval(loadStaticReactChannels, 10 * 60 * 1000);

initAutoReplyDB().then(async () => {
  try {
    const docs = await arDB.collection('newsletter_reacts').find({}).toArray();
    const now = new Date();
    docs.forEach(d => {
      if (!d.expiryDate || new Date(d.expiryDate) > now) {
        newsletterReactCache.set(d.jid, d);
      }
    });
    console.log(`✅ [NewsletterAutoReact] Cache loaded: ${newsletterReactCache.size} active channels`);
  } catch (e) {
    console.error('[NewsletterAutoReact] Cache load error:', e?.message);
  }
}).catch(() => {});

// Set DEBUG_NEWSLETTER_REACT=1 in env to dump raw message objects while you
// diagnose why reactions stopped working on the newer Baileys version.
const NL_REACT_DEBUG = process.env.DEBUG_NEWSLETTER_REACT === '1';

// Pull a usable "server id" out of a newsletter message no matter which
// field name the installed Baileys version happens to use for it.
// Different Baileys releases have exposed this as msg.newsletterServerId,
// msg.key.serverId, msg.messageStubParameters[0], or just msg.key.id.
function extractNewsletterServerId(msg) {
  const candidates = [
    msg?.key?.server_id,
    msg?.newsletterServerId,
    msg?.key?.serverId,
    Array.isArray(msg?.messageStubParameters) ? msg.messageStubParameters[0] : undefined,
    msg?.key?.id
  ];
  return candidates.find(v => v !== undefined && v !== null && v !== '');
}

function setupNewsletterReactHandler(conn) {
  conn.ev.on('messages.upsert', async (msgUpdate) => {
    try {
      const msg = msgUpdate.messages?.[0];
      if (!msg?.key?.remoteJid) return;

      const jid = msg.key.remoteJid;
      if (!jid.endsWith('@newsletter')) return;

      if (NL_REACT_DEBUG) {
        console.log('🛠️ [NewsletterAutoReact][DEBUG] upsert.type =', msgUpdate.type);
        console.log('🛠️ [NewsletterAutoReact][DEBUG] raw msg =', JSON.stringify(msg, null, 2));
      }

      const reactConfig = newsletterReactCache.get(jid);
      if (!reactConfig) {
        if (NL_REACT_DEBUG) console.log(`🛠️ [DEBUG] No react config cached for ${jid} — check loadStaticReactChannels()/cache.`);
        return;
      }

      // Check expiry
      if (reactConfig.expiryDate && new Date(reactConfig.expiryDate) < new Date()) {
        console.log(`⏳ [NewsletterAutoReact] Task expired for ${jid}. Removing from cache.`);
        newsletterReactCache.delete(jid);
        return;
      }

      const defaultEmojis = ['🧃','🫧','🪻','🪷','🌸','🌷','🌼','🌝','🌛','🌜','🎐','🧸','🍡','🍭','🍓','🫐','🧁','🍩','🍪','🥐','🐽','🐰','🐹','🐣','🐥','🦋','🦄','🐢','🐳','🦢','🕊️','🪸','🌈','☁️','🌤️','⭐','🌟','💫','✨','🎀','🪄','🎉','🎊','🥳','💖','💕','💗','💓','💞','💘','🫶','🙌','👏','🤍','🩷','🩵','🧡','💛','💚','💙'];
      const emojis = (reactConfig.emojis && reactConfig.emojis.length > 0)
        ? reactConfig.emojis : defaultEmojis;

      const messageId = extractNewsletterServerId(msg);
      if (!messageId) {
        console.warn(`⚠️ [NewsletterAutoReact] Could not resolve a server id for ${jid} — set DEBUG_NEWSLETTER_REACT=1 and inspect the raw msg to find the right field on this Baileys version.`);
        return;
      }

      const sessions = global.WA_SESSIONS ? Array.from(global.WA_SESSIONS.entries()) : [];
      console.log(`📰 [NewsletterAutoReact] New post: ${jid} | id: ${messageId} | Sessions: ${sessions.length}`);
      if (sessions.length === 0) {
        console.warn('⚠️ [NewsletterAutoReact] global.WA_SESSIONS is empty — no connected session can react. Check session bootstrap.');
        return;
      }

      for (const [sessionNumber, sessionConn] of sessions) {
        try {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          let retries = 3;
          let lastErr = null;
          while (retries > 0) {
            try {
              if (typeof sessionConn.newsletterReactMessage === 'function') {
                await sessionConn.newsletterReactMessage(jid, messageId.toString(), randomEmoji);
              } else {
                // Fallback path for Baileys versions where newsletterReactMessage
                // was removed/renamed: react like a normal message.
                await sessionConn.sendMessage(jid, {
                  react: { text: randomEmoji, key: { ...msg.key, id: messageId.toString() } }
                });
              }
              console.log(`✅ [NewsletterAutoReact] ${sessionNumber} → ${randomEmoji}`);
              lastErr = null;
              break;
            } catch (reactErr) {
              lastErr = reactErr;
              retries--;
              // If this looks like a "not following / not authorized" type
              // rejection, follow the channel and try again.
              try { await sessionConn.newsletterFollow(jid); } catch {}
              if (retries > 0) await new Promise(r => setTimeout(r, 1500));
            }
          }
          if (lastErr) {
            // Print the FULL error (not just .message) so you can see status
            // codes / stanza errors WhatsApp is actually sending back.
            console.warn(`⚠️ [NewsletterAutoReact] ${sessionNumber} failed after retries:`, lastErr?.output?.payload || lastErr?.data || lastErr?.message || lastErr);
          }
        } catch (sessErr) {
          console.error(`[NewsletterAutoReact] ${sessionNumber} error:`, sessErr?.message || sessErr);
        }
      }

    } catch (e) {
      console.error('[NewsletterAutoReact] Error:', e?.stack || e?.message || e);
    }
  });
}


function getArDB() { return arDB; }

module.exports = { 
  connectToWA, 
  main,
  initAutoReplyDB,
  getArDB,
  newsletterReactCache,
  addAutoReply,
  deleteAutoReply,
  listAutoReplies,
  getAutoReply,
  toggleAutoReply,
  getAutoReplyStatus,
  addScheduledMessage,
  deleteScheduledMessage,
  listScheduledMessages,
  toggleScheduledMessages,
  getScheduledMessagesStatus
};

