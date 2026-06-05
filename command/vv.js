// ============================================================
// COMMAND: vv
// MEZUKA MD V5 - command/vv.js
// ============================================================

module.exports = {
    name: "vv",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {

        await m.react("🖨️");

        const fs = require("fs");
        const path = require("path");
        const Crypto = require("crypto");

        if (!quoted) {
            return reply("⚠️ Please quote a ViewOnce image or video!");
        }

        const quot = mek.msg.contextInfo.quotedMessage;
        const cap = quot.msg?.caption || '';

        // ── Sent timestamp ─────────────────────────────────────
        const rawTs = quoted.messageTimestamp || mek.messageTimestamp;
        const sentDate = new Date(rawTs * 1000);
        const sentStr = sentDate.toLocaleString("en-US", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        // ── Media type ─────────────────────────────────────────
        let mediaType = '';
        if (quoted.type.includes("image")) {
            mediaType = "jpg";
        } else if (quoted.type.includes("video")) {
            mediaType = "mp4";
        } else {
            mediaType = "mp3";
        }

        const tempFileName = `Mezuka_MD_V4(conn)_${Crypto.randomBytes(8).toString('hex')}.${mediaType}`;
        const tempFilePath = path.join(__dirname, 'temp', tempFileName);

        // ── Download media ─────────────────────────────────────
        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) {
            return reply("⚠️ Failed to download the media. Please try again.");
        }

        // ── File size ──────────────────────────────────────────
        const bytes = mediaBuffer.length;
        let sizeStr = '';
        if (bytes < 1024) {
            sizeStr = `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            sizeStr = `${(bytes / 1024).toFixed(2)} KB`;
        } else {
            sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }

        fs.writeFileSync(tempFilePath, mediaBuffer);

        if (!fs.existsSync(tempFilePath)) {
            return reply("⚠️ Media file could not be found after download.");
        }

        // ── Build caption ──────────────────────────────────────
        const finalCaption =
            (cap ? cap + "\n\n" : "") +
            `📦 *Size :* ${sizeStr}\n` +
            `🕐 *Sent :* ${sentStr}\n\n` +
            `✨ *Powered by* 𝑴𝒆𝒛𝒖𝒌𝒂 𝑴𝑫 𝑽𝟒 🐾`;

        // ── Context info (channel forward tag) ────────────────
        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        };

        // ── Send media ─────────────────────────────────────────
        if (quoted.type.includes("image")) {
            await conn.sendMessage(from, {
                image: { url: tempFilePath },
                caption: finalCaption,
                contextInfo
            }, { quoted: adhiqmini });

        } else if (quoted.type.includes("video")) {
            await conn.sendMessage(from, {
                video: { url: tempFilePath },
                caption: finalCaption,
                mimetype: "video/mp4",
                contextInfo
            }, { quoted: adhiqmini });

        } else {
            await conn.sendMessage(from, {
                audio: { url: tempFilePath },
                mimetype: "audio/mp4",
                ptt: true,
                contextInfo
            }, { quoted: adhiqmini });
        }

        // ── Cleanup temp file ──────────────────────────────────
        fs.unlinkSync(tempFilePath);

    } catch (e) {
        reply(e);
    }

    }
};
