// ============================================================
// COMMAND: gdrive
// MEZUKA MD V5 - command/gdrive.js
// ============================================================

module.exports = {
    name: "gdrive",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    try {
        

        await m.react('⤵️');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴍᴇ ɢᴅʀɪᴠᴇ ʟɪɴᴋ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .gdrive https://drive.google.com/...`);

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɢᴅʀɪᴠᴇ ꜰᴇᴛᴄʜɪɴɢ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔗 ${q}` });
        await m.react('⤴️');

        const res = await axios.get(`https://saviya-kolla-api.koyeb.app/download/gdrive?url=${encodeURIComponent(q)}`);

        if (!res.data?.status || !res.data.result) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ꜰᴀɪʟᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Failed to fetch file info!`);

        const file = res.data.result;

        await conn.sendMessage(from, {
            document: {
                url: file.downloadLink,
                mimetype: file.mimeType || 'application/octet-stream',
                fileName: file.name
            },
            caption: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɢᴅʀɪᴠᴇ ꜰɪʟᴇ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n📂 *ɴᴀᴍᴇ* ➤ ${file.name}\n💾 *sɪᴢᴇ* ➤ ${file.size}\n\n${GQCAP}`
        }, { quoted: adhiqmini });

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
