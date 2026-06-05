// ============================================================
// COMMAND: tiktok
// MEZUKA MD V5 - command/tiktok.js
// ============================================================

module.exports = {
    name: "tiktok",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    try {
        

        await conn.sendMessage(from, { react: { text: '🖥️', key: mek.key } });

        if (!q) return reply("Please give me a TikTok video URL.");

        await conn.sendMessage(from, { text: `\n\n✰𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹✰ 𝚃𝙸𝙺𝚃𝙾𝙺 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶.....` });
        await m.react('⤵');

        const apiUrl = `https://www.movanest.xyz/v2/tiktok?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (!data.status || !data.results) return reply("❌ Failed to fetch TikTok video!");

        const title = data.results.title || 'TikTok Video';
        const dlsd = data.results.no_watermark || null;
        const dlaudio = data.results.music || null;

        const vvvv = await conn.sendMessage(from, {
            video: { url: dlsd },
            caption: `\n❍ 𝚃𝙸𝙺𝚃𝙾𝙺 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳\n  ❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮\n\n📝 ${title}\n\n* 𝙾𝚃𝙷𝙴𝚁 𝚀𝚄𝙻𝙸𝚃𝚈 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳📥\n\n❍ 1┊ ❮ *𝙽𝙾 𝚆𝙰𝚃𝙴𝚁𝙼𝙰𝚁𝙺 𝚅𝙸𝙳𝙴𝙾* ❯\n❍ 2┊ ❮ *𝙰𝚄𝙳𝙸𝙾 𝙼𝙿3* ❯\n❍ 3┊ ❮ *𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃* ❯\n❍ 4┊ ❮ *𝚅𝙾𝙸𝙲𝙴 𝚃𝚈𝙿𝙴* ❯\n\n* \`📩 Reply To Number\`\n\n${GQCAP}`
        }, { quoted: adhiqmini });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo?.stanzaId !== vvvv.key.id) return;

            await conn.sendMessage(from, { react: { text: '⬇️', key: msg.key } });

            switch (selectedOption) {
                case "1":
                    await conn.sendMessage(from, { video: { url: dlsd }, caption: `> Downloaded No Watermark ✅` }, { quoted: adhiqmini });
                    break;
                case "2":
                    await conn.sendMessage(from, { audio: { url: dlaudio }, mimetype: "audio/mpeg", fileName: `tiktok_audio.mp3`, caption: `> Downloaded in Audio Quality 🎵` }, { quoted: adhiqmini });
                    break;
                case "3":
                    await conn.sendMessage(from, { document: { url: dlsd }, mimetype: "video/mp4", fileName: `tiktok_video.mp4`, caption: `> Downloaded as Document 📄` }, { quoted: adhiqmini });
                    break;
                case "4":
                    await conn.sendMessage(from, { audio: { url: dlaudio }, mimetype: "audio/mp4", ptt: true }, { quoted: adhiqmini });
                    break;
                default:
                    reply("Invalid choice. Please reply with a valid number (1-4).");
            }

            await conn.sendMessage(from, { react: { text: '⬆️', key: msg.key } });
        });

    } catch (e) {
        reply(e.message);
    }

    }
};
