// ============================================================
// COMMAND: flux
// MEZUKA MD V5 - command/flux.js
// ============================================================

module.exports = {
    name: "flux",
    aliases: ["aiimage", "imagen", "draw", "genimage"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');

    const contextInfo = {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: "Mezuka MD V5✻",
            serverMessageId: 999,
        }
    };

    const IMAGE_APIS = [
        (p) => `https://stable.stacktoy.workers.dev/?apikey=Suhail&prompt=${encodeURIComponent(p)}`,
        (p) => `https://dalle.stacktoy.workers.dev/?apikey=Suhail&prompt=${encodeURIComponent(p)}`,
        (p) => `https://flux.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(p)}`
    ];

    const generateImage = async (prompt) => {
        for (const apiUrl of IMAGE_APIS) {
            try {
                const { data } = await axios.get(apiUrl(prompt), {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                const buf = Buffer.from(data);
                if (buf[0] === 0x89 || buf[0] === 0xFF) return buf;
            } catch {
                continue;
            }
        }
        throw new Error('All image generation APIs failed');
    };

    const enhancePrompt = (prompt) => {
        const enhancers = [
            'high quality', 'detailed', 'masterpiece', 'best quality',
            'ultra realistic', '4k', 'highly detailed', 'cinematic lighting'
        ];
        const selected = enhancers
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 2) + 3);
        return `${prompt}, ${selected.join(', ')}`;
    };

    try {

        await m.react('🎨');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴀɪ ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .flux a beautiful sunset over mountains`);

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɢᴇɴᴇʀᴀᴛɪɴɢ ɪᴍᴀɢᴇ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🎨 ᴘʀᴏᴍᴘᴛ ➤ ${q}\n\n⏳ ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...` });
        await m.react('⏳');

        const enhanced = enhancePrompt(q);
        const imageBuffer = await generateImage(enhanced);

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴀɪ ɢᴇɴᴇʀᴀᴛᴇᴅ ɪᴍᴀɢᴇ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🎨 *ᴘʀᴏᴍᴘᴛ* ➤ ${q}\n\n${GQCAP}`,
            contextInfo: contextInfo
        }, { quoted: adhiqmini });

        await m.react('✅');

    } catch (e) {
        await m.react('❌');
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
