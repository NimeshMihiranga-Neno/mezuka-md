
module.exports = {
    name: "save",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        const fs = require("fs");
        const path = require("path");

        await conn.sendMessage(from, { react: { text: '🧚', key: mek.key } });

        if (!m.quoted) {
            return reply("Please reply to a status or message with media that you want to save.");
        }

        const quotedMsg = m.quoted;
        const mediaType = quotedMsg.type || quotedMsg.mtype;
        let mediaData;
        let fileExtension = '';
        let mimeType = '';

        switch (mediaType) {
            case 'imageMessage':
                mediaData = await quotedMsg.download() || await conn.downloadMediaMessage(quotedMsg);
                fileExtension = 'jpg';
                mimeType = 'image/jpeg';
                break;
            case 'videoMessage':
                mediaData = await quotedMsg.download() || await conn.downloadMediaMessage(quotedMsg);
                fileExtension = 'mp4';
                mimeType = 'video/mp4';
                break;
            case 'audioMessage':
                mediaData = await quotedMsg.download() || await conn.downloadMediaMessage(quotedMsg);
                fileExtension = 'ogg';
                mimeType = 'audio/ogg';
                break;
            case 'documentMessage':
                mediaData = await quotedMsg.download() || await conn.downloadMediaMessage(quotedMsg);
                fileExtension = quotedMsg.fileName ? quotedMsg.fileName.split('.').pop() : 'bin';
                mimeType = quotedMsg.mimetype || 'application/octet-stream';
                break;
            default:
                return reply("The replied message does not contain supported media. Please reply to an image, video, audio, or document.");
        }

        if (!mediaData) {
            return reply("Failed to download the media.");
        }

        const mediaDir = path.join(__dirname, 'media');
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir);
        }

        const filename = `🌟 MEZUKA MD V5 USER BOT 🌟 | ${Date.now()}.${fileExtension}`;
        const filePath = path.join(mediaDir, filename);
        fs.writeFileSync(filePath, mediaData);

        if (mediaType === 'imageMessage') {
            await conn.sendMessage(from, { image: { url: filePath }, caption: `\n\n *✅ MEZUKA MD V5 IMAGE SAVED*` }, { quoted: adhiqmini });
        } else if (mediaType === 'videoMessage') {
            await conn.sendMessage(from, { video: { url: filePath }, caption: `\n\n *✅ MEZUKA MD V5 VIDEO SAVED*` }, { quoted: adhiqmini });
        } else if (mediaType === 'audioMessage') {
            await conn.sendMessage(from, { audio: { url: filePath }, mimetype: mimeType }, { quoted: adhiqmini });
        } else {
            await conn.sendMessage(from, { document: fs.readFileSync(filePath), mimetype: mimeType, fileName: filename }, { quoted: m });
        }

    } catch (e) {
        reply('⚠️ An error occurred while saving the media.');
    }

    }
};
