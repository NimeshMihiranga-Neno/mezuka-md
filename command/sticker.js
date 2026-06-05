// ============================================================
// COMMAND: sticker
// MEZUKA MD V5 - command/sticker.js
// ============================================================

module.exports = {
    name: "sticker",
    aliases: ["s"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        await conn.sendMessage(from, { react: { text: '💫', key: mek.key } });

        const media = await quoted.download();
        if (!media) return reply(`*Failed to download media.*`);

        const { Sticker, StickerTypes } = require('wa-sticker-formatter');
        const sticker = new Sticker(media, {
            pack: pushname || 'Mezuka MD V5👑',
            author: 'Mezuka MD V5👑',
            type: StickerTypes.FULL || StickerTypes.CROPPED,
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
