// ============================================================
// COMMAND: img
// MEZUKA MD V5 - command/img.js
// ============================================================

module.exports = {
    name: "img",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    try {
        

        await m.react('⤵️');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴍᴇ ᴀ ǫᴜᴇʀʏ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .img sunset`);

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɪᴍᴀɢᴇ sᴇᴀʀᴄʜɪɴɢ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔍 ${q}` });
        await m.react('⤴️');

        const res = await axios.get(`https://allstars-apis.vercel.app/pinterest?search=${encodeURIComponent(q)}`);
        const data = res.data.data;

        if (!data || data.length === 0) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɴᴏ ɪᴍᴀɢᴇs* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ No images found for: ${q}`);

        const randomImage = data[Math.floor(Math.random() * data.length)];

        await conn.sendMessage(from, {
            image: { url: randomImage },
            caption: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɪᴍᴀɢᴇ ʀᴇsᴜʟᴛ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔍 *ǫᴜᴇʀʏ* ➤ ${q}\n\n${GQCAP}`
        }, { quoted: adhiqmini });

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
