// ============================================================
// COMMAND: google / gsearch / search
// MEZUKA MD V5 - command/google.js
// ============================================================

module.exports = {
    name: "google",
    aliases: ["gsearch", "search"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    try {
        

        await m.react('⤵️');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴍᴇ ᴀ sᴇᴀʀᴄʜ ǫᴜᴇʀʏ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .google how to code in javascript`);

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɢᴏᴏɢʟᴇ sᴇᴀʀᴄʜɪɴɢ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔍 ${q}` });
        await m.react('⤴️');

        const apiKey = "AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI";
        const cx = "baf9bdb0c631236e5";
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&key=${apiKey}&cx=${cx}`);

        if (response.status !== 200 || !response.data.items || response.data.items.length === 0) {
            return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɴᴏ ʀᴇsᴜʟᴛs* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ No results found for: ${q}`);
        }

        let results = '';
        response.data.items.slice(0, 5).forEach((item, index) => {
            results += `❍ ${index + 1}┊ *${item.title}*\n🔗 ${item.link}\n📝 ${item.snippet}\n\n`;
        });

        const firstResult = response.data.items[0];
        const thumbnailUrl = firstResult.pagemap?.cse_image?.[0]?.src ||
                             firstResult.pagemap?.cse_thumbnail?.[0]?.src ||
                             require('../image').AEEO1I;

        await conn.sendMessage(from, {
            image: { url: thumbnailUrl },
            caption: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɢᴏᴏɢʟᴇ sᴇᴀʀᴄʜ ʀᴇsᴜʟᴛs* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔍 *ǫᴜᴇʀʏ* ➤ ${q}\n\n❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮\n\n${results}\n${GQCAP}`
        }, { quoted: adhiqmini });

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
