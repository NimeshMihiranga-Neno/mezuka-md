module.exports = {
    name: "attp",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fs = require('fs');
    const path = require('path');
    const Crypto = require("crypto");
    const { tmpdir } = require("os");
    const ffmpeg = require('./lib/ffmpeg');
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const getBuffer = require('./lib/getBuffer');

    async function videoToWebp(videoBuffer) {
        const outputFilePath = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
        const tempVideoPath = path.join(tmpdir(), Crypto.randomBytes(6).readUIntLE(0, 6).toString(36) + ".mp4");
        fs.writeFileSync(tempVideoPath, videoBuffer);
        await new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath).on("error", reject).on("end", () => resolve(true))
                .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse", "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"])
                .toFormat("webp").save(outputFilePath);
        });
        const outputBuffer = fs.readFileSync(outputFilePath);
        fs.unlinkSync(outputFilePath);
        fs.unlinkSync(tempVideoPath);
        return outputBuffer;
    }

    try {
        
        await conn.sendMessage(from, { react: { text: '🧚', key: mek.key } });
        if (!q) return reply('*Please give me a text!*');
        let stickerBuffer = await getBuffer('https://api-fix.onrender.com/api/maker/attp?text=' + q);
        const webpSticker = await videoToWebp(stickerBuffer);
        await conn.sendMessage(from, { sticker: webpSticker }, { quoted: adhiqmini });
    } catch (e) { reply(`Error: ${e.message}`); }
    }
};
