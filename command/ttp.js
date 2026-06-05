module.exports = {
    name: "ttp",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const getBuffer = require('./lib/getBuffer');
    try {
        
        await conn.sendMessage(from, { react: { text: '🧚', key: mek.key } });
        if (!q) return reply('*Please give me a text!*');
        let stickerBuffer = await getBuffer('https://api-fix.onrender.com/api/maker/ttp?text=' + q);
        const isCropped = q.includes('--crop') || q.includes('-c');
        const sticker = new Sticker(stickerBuffer, { pack: 'Queen Spriky MD', author: pushname, type: isCropped ? StickerTypes.CROPPED : StickerTypes.FULL, categories: ['🤩', '🎉'], id: '12345', quality: 75, background: 'transparent' });
        await conn.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: adhiqmini });
    } catch (e) { reply(`Error: ${e.message}`); }
    }
};
