// ============================================================
// COMMAND: ig
// MEZUKA MD V5 - command/ig.js
// ============================================================

module.exports = {
    name: "ig",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        await m.react('⬇️');

        const igUrl = q;
        if (!igUrl || !igUrl.includes("instagram.com")) {
            return reply("❌ Please provide an Instagram link!\n\n*Usage:* .ig <Instagram URL>\n*Example:* .ig https://instagram.com/reel/...");
        }

        const axios = require('axios');
        const fs = require('fs');
        const path = require('path');

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(igUrl)}`;
        const response = await axios.get(apiUrl, { maxRedirects: 5, timeout: 30000 });

        if (!response.data?.status || !response.data.data?.length) {
            await m.react('❌');
            return reply("❌ Failed to fetch media. Invalid link or private content.");
        }

        const media = response.data.data[0];
        const { type, thumbnail, url: videoUrl } = media;

        await m.react('⤴️');

        let caption = `📸 *INSTAGRAM DOWNLOADER*\n\n`;
        caption += `📹 *Type:* ${type.toUpperCase()}\n\n`;
        caption += `━━━━━━━━━━━━━━━━━\n\n`;
        caption += `📌 *Select Download Option:*\n\n`;
        caption += `1️⃣ - 🎬 Video\n`;
        caption += `2️⃣ - 📄 Document\n\n`;
        caption += `Reply with a number (1-2)\n\n`;
        caption += `> ©ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3 ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ`;

        const optionsMsg = await conn.sendMessage(
            from,
            {
                image: { url: thumbnail },
                caption: caption,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363424190766692@newsletter',
                        newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
                        serverMessageId: 143
                    }
                }
            },
            { quoted: adhiqmini }
        );

        global.igDownloads = global.igDownloads || {};
        global.igDownloads[from] = {
            videoUrl,
            thumbnail,
            type,
            messageId: optionsMsg.key.id,
            timestamp: Date.now(),
            waiting: true
        };

        const numberListener = async (update) => {
            try {
                const newMsg = update?.messages?.[0];
                if (!newMsg?.message) return;
                if (newMsg.key.remoteJid !== from) return;

                const igData = global.igDownloads[from];
                if (!igData || !igData.waiting) return;

                const userReply =
                    newMsg.message?.conversation ||
                    newMsg.message?.extendedTextMessage?.text || '';

                const choice = userReply.trim();
                if (!['1', '2'].includes(choice)) return;

                igData.waiting = false;
                conn.ev.off('messages.upsert', numberListener);

                let downloadType = choice === '1' ? 'video' : 'document';

                await conn.sendMessage(from, {
                    text: `⬇️ *Downloading ${downloadType.toUpperCase()}...*\n\n⏳ Please wait...`
                }, { quoted: newMsg });

                const tempDir = path.join(__dirname, 'temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

                const unique = Date.now();

                const fileResponse = await axios.get(igData.videoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 60000
                });

                const fileSize = (fileResponse.data.length / 1024 / 1024).toFixed(2);
                const filePath = path.join(tempDir, `ig_${unique}.mp4`);
                fs.writeFileSync(filePath, fileResponse.data);

                const fileCaption = `📸 *INSTAGRAM VIDEO*\n\n📦 Size: ${fileSize} MB\n\n> ©ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3 ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ`;

                const contextInfo = {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363424190766692@newsletter',
                        newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`,
                        serverMessageId: 143
                    }
                };

                if (downloadType === 'video') {
                    await conn.sendMessage(from, {
                        video: fs.readFileSync(filePath),
                        caption: fileCaption,
                        contextInfo
                    }, { quoted: newMsg });
                } else {
                    await conn.sendMessage(from, {
                        document: fs.readFileSync(filePath),
                        mimetype: 'video/mp4',
                        fileName: `Instagram_${unique}.mp4`,
                        caption: fileCaption,
                        contextInfo
                    }, { quoted: newMsg });
                }

                fs.unlinkSync(filePath);
                await m.react('✅');
                delete global.igDownloads[from];

            } catch (err) {
                await conn.sendMessage(from, { text: `❌ Download Error!\n\n${err.message}` });
                delete global.igDownloads[from];
            }
        };

        conn.ev.on('messages.upsert', numberListener);

        setTimeout(() => {
            if (global.igDownloads[from]?.waiting) {
                conn.ev.off('messages.upsert', numberListener);
                delete global.igDownloads[from];
            }
        }, 5 * 60 * 1000);

    } catch (e) {
        await m.react('❌');
        reply(`❌ Error occurred!\n\n${e.message}`);
    }

    }
};
