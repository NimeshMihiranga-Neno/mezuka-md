// ============================================================
// COMMAND: rsticker (Round/Circle sticker)
// MEZUKA MD V5 - command/rsticker.js
// ============================================================

module.exports = {
    name: "rsticker",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        await conn.sendMessage(from, { react: { text: '💫', key: mek.key } });

        function getRandomString(length = 16) {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
            return result;
        }

        const media = await quoted.download();
        if (!media) return reply(`*Failed to download media.*`);

        const { Sticker, StickerTypes } = require('wa-sticker-formatter');
        const sticker = new Sticker(media, {
            pack: pushname || 'Mezuka MD V5👑',
            author: 'Mezuka MD V5👑',
            type: StickerTypes.CIRCLE,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 75,
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: buffer }, { quoted: adhiqmini });

    } catch (e) {
        reply(e.message);
    }

    }
};
