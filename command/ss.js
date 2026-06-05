module.exports = {
    name: "ss",
    aliases: ["screenshot", "webss"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    try {
        

        await m.react('⤵️');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴍᴇ ᴀ ᴜʀʟ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .ss https://google.com`);

        let formattedUrl = q;
        if (!q.startsWith('http://') && !q.startsWith('https://')) formattedUrl = 'https://' + q;

        try { new URL(formattedUrl); } catch (e) {
            return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɪɴᴠᴀʟɪᴅ ᴜʀʟ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉`);
        }

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ꜱᴄʀᴇᴇɴꜱʜᴏᴛ ᴛᴀᴋɪɴɢ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔗 ${formattedUrl}` });
        await m.react('⤴️');

        const screenshotAPIs = [
            `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(formattedUrl)}&dimension=1024x768`,
            `https://image.thum.io/get/width/1024/crop/768/${encodeURIComponent(formattedUrl)}`,
            `https://shot.screenshotapi.net/screenshot?token=demo&url=${encodeURIComponent(formattedUrl)}&output=image&file_type=png&wait_for_event=load`
        ];

        let buffer = null;
        for (let i = 0; i < screenshotAPIs.length; i++) {
            try {
                const response = await axios.get(screenshotAPIs[i], {
                    responseType: 'arraybuffer',
                    timeout: 45000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });
                buffer = Buffer.from(response.data);
                break;
            } catch (e) { continue; }
        }

        if (!buffer) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ꜰᴀɪʟᴇᴅ ᴛᴏ ᴄᴀᴘᴛᴜʀᴇ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ All APIs failed. Please try again!`);

        await conn.sendMessage(from, {
            image: buffer,
            caption: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ꜱᴄʀᴇᴇɴꜱʜᴏᴛ ʀᴇᴀᴅʏ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔗 *ᴜʀʟ* ➤ ${formattedUrl}\n📐 *ꜱɪᴢᴇ* ➤ 1024x768\n⏰ *ᴛɪᴍᴇ* ➤ ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}\n\n${GQCAP}`
        }, { quoted: adhiqmini });

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
