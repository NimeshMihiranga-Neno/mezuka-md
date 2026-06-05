module.exports = {
    name: "tomp3",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fs = require('fs');
    const path = require('path');
    const ffmpeg = require('./lib/ffmpeg');

    
    await conn.sendMessage(from, { react: { text: '🎵', key: mek.key } });
    try {
        const isVideoMessage = quoted ? quoted.type === "videoMessage" : false;
        if (!isVideoMessage) return reply("Please reply to a video.");
        const videoData = await quoted.download();
        const audioData = await ffmpeg(videoData, ["-vn", "-c:a", "libopus", "-b:a", "128k", "-vbr", "on", "-compression_level", "10"], "mp4", "opus");
        const sentAudio = await conn.sendMessage(from, { audio: audioData.options, mimetype: "audio/mpeg" }, { quoted: adhiqmini });
        await conn.sendMessage(from, { react: { text: '🎼', key: sentAudio.key } });
    } catch (e) { reply("*Error!!*"); }
    }
};
