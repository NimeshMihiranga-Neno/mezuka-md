module.exports = {
    name: "emojimix",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fetch = require('node-fetch');
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');

    
    await conn.sendMessage(from, { react: { text: '💫', key: mek.key } });
    try {
        if (!q) return reply("Please provide two emojis separated by a space.\n\nExample: `.emojimix 😀 🤔`");
        const [emoji1, emoji2] = q;
        if (!emoji1 || !emoji2) return reply("Invalid input. Please provide two valid emojis.");
        const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
        const response = await fetch(url);
        if (!response.ok) return reply("Failed to fetch the sticker. Please try again later.");
        const data = await response.json();
        if (!data.results || data.results.length === 0) return reply("No sticker found for the given emoji combination.");
        const stickerUrl = data.results[0].media_formats.png_transparent.url;
        const stickerBuffer = await fetch(stickerUrl).then(res => res.buffer());
        const sticker = new Sticker(stickerBuffer, { pack: 'Mezuka MD V5', author: pushname || 'Mezuka MD V5', type: StickerTypes.FULL, categories: ['🤩', '🎉'], id: 'emoji-kitchen', quality: 75, background: 'transparent' });
        const stickerOutput = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: stickerOutput }, { quoted: adhiqmini });
    } catch (e) { reply("An error occurred. Please try again later."); }
    }
};
