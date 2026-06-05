// ============================================================
// COMMAND: cartoon
// MEZUKA MD V5 - command/cartoon.js
// ============================================================

module.exports = {
    name: "cartoon",
    aliases: ["ct", "sinhala"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, adhiqmini, prefix }) {

    try {
        const axios = require('axios');
        const fs = require('fs');
        const path = require('path');

        const CARTOON_API = "https://cartoon-scrap.onrender.com";
        const LIST_BANNER = "https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/c43aaa113275aa4f2ac0c9d10c603909.jpg";
        const NEWSLETTER = {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: 'ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3',
            serverMessageId: 143
        };

        // ========== Cartoon list ==========
        const res = await axios.get(`${CARTOON_API}/api/new?limit=10`, { timeout: 30000 });
        if (!res.data.success) return reply("❌ Failed to load cartoon list!");

        const cartoons = res.data.data.slice(0, 10);

        // ========== List message ==========
        let listText = `🎬 *ᶦᶰᵈ᭄ ᴍᴇᴢᴜᴋᴀ ᴍᴅ 亗*\n\n`;
        listText += `📺 *Latest Sinhala Cartoons - Top 10*\n`;
        listText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        cartoons.forEach((c, i) => {
            listText += `*${i + 1}. ${c.title}*\n`;
        });
        listText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        listText += `_Reply with a number (1-10) to select_ ⬆️`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: LIST_BANNER },
            caption: listText,
            contextInfo: {
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: NEWSLETTER
            }
        }, { quoted: adhiqmini });

        const messageID = sentMsg.key.id;

        global.cartoonSessions = global.cartoonSessions || {};
        global.cartoonSessions[messageID] = {
            cartoons,
            from,
            expiry: Date.now() + 5 * 60 * 1000
        };

        // ========== Selection listener ==========
        const replyListener = async (upsert) => {
            try {
                for (const replyMsg of (upsert?.messages || [])) {
                    if (!replyMsg?.message) continue;
                    if (replyMsg.key.remoteJid !== from) continue;

                    const quotedId = replyMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;
                    if (quotedId !== messageID) continue;

                    const replyText = (
                        replyMsg.message?.extendedTextMessage?.text ||
                        replyMsg.message?.conversation || ''
                    ).trim();

                    const num = parseInt(replyText);
                    if (isNaN(num) || num < 1 || num > 10) {
                        await conn.sendMessage(from, {
                            text: `❌ Invalid! Reply with a number between 1 and 10.`
                        }, { quoted: replyMsg });
                        continue;
                    }

                    const session = global.cartoonSessions[messageID];
                    if (!session) {
                        await conn.sendMessage(from, {
                            text: `❌ Session expired! Use *.cartoon* again.`
                        }, { quoted: replyMsg });
                        conn.ev.off('messages.upsert', replyListener);
                        return;
                    }

                    const selected = session.cartoons[num - 1];
                    conn.ev.off('messages.upsert', replyListener);
                    delete global.cartoonSessions[messageID];

                    await conn.sendMessage(from, {
                        text: `🔍 *Loading details...*\n\n*${selected.title}*\n\nPlease wait...`
                    }, { quoted: replyMsg });

                    // ========== Details fetch ==========
                    const detailRes = await axios.get(`${CARTOON_API}/api/details?id=${selected.id}`, { timeout: 30000 });
                    if (!detailRes.data.success) {
                        return await conn.sendMessage(from, {
                            text: `❌ Failed to load details!`
                        }, { quoted: replyMsg });
                    }

                    const cartoon = detailRes.data.data;
                    const directLink = cartoon.download_links.find(l => l.type === 'direct');
                    const telegramLink = cartoon.download_links.find(l => l.type === 'telegram');

                    const detailText =
                        `🎬 *ᶦᶰᵈ᭄ ᴍᴇᴢᴜᴋᴀ ᴍᴅ 亗*\n\n` +
                        `📌 *${cartoon.title}*\n` +
                        `━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `📖 *Story:*\n${cartoon.description?.substring(0, 300)}${cartoon.description?.length > 300 ? '...' : ''}\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━\n` +
                        `📥 *Select a download option:*\n\n` +
                        `*1 - 🎬 Direct Download (MP4)*\n` +
                        `*2 - 📱 Telegram Bot Link*\n\n` +
                        `_Reply with 1 or 2_ ⬆️`;

                    const detailMsg = await conn.sendMessage(from, {
                        image: { url: cartoon.banner },
                        caption: detailText,
                        contextInfo: {
                            forwardingScore: 1000,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: NEWSLETTER
                        }
                    }, { quoted: replyMsg });

                    const detailMsgID = detailMsg.key.id;

                    global.cartoonDownloads = global.cartoonDownloads || {};
                    global.cartoonDownloads[detailMsgID] = {
                        cartoon,
                        directLink,
                        telegramLink,
                        from,
                        expiry: Date.now() + 5 * 60 * 1000
                    };

                    // ========== Download listener ==========
                    const downloadListener = async (upsert2) => {
                        try {
                            for (const dlMsg of (upsert2?.messages || [])) {
                                if (!dlMsg?.message) continue;
                                if (dlMsg.key.remoteJid !== from) continue;

                                const dlQuotedId = dlMsg.message?.extendedTextMessage?.contextInfo?.stanzaId;
                                if (dlQuotedId !== detailMsgID) continue;

                                const dlChoice = (
                                    dlMsg.message?.extendedTextMessage?.text ||
                                    dlMsg.message?.conversation || ''
                                ).trim();

                                if (!['1', '2'].includes(dlChoice)) {
                                    await conn.sendMessage(from, {
                                        text: `❌ Invalid! Reply with *1* or *2* only.`
                                    }, { quoted: dlMsg });
                                    continue;
                                }

                                const dlData = global.cartoonDownloads[detailMsgID];
                                if (!dlData) {
                                    await conn.sendMessage(from, {
                                        text: `❌ Session expired! Use *.cartoon* again.`
                                    }, { quoted: dlMsg });
                                    conn.ev.off('messages.upsert', downloadListener);
                                    return;
                                }

                                conn.ev.off('messages.upsert', downloadListener);
                                delete global.cartoonDownloads[detailMsgID];

                                if (dlChoice === '2') {
                                    // ===== Telegram link =====
                                    const tgLink = dlData.telegramLink?.direct_url || dlData.cartoon.link;
                                    await conn.sendMessage(from, {
                                        text:
                                            `📱 *Telegram Download Link*\n\n` +
                                            `🎬 *${dlData.cartoon.title}*\n\n` +
                                            `🔗 ${tgLink}\n\n` +
                                            `_Click the link and download from the bot!_`,
                                        contextInfo: {
                                            forwardingScore: 1000,
                                            isForwarded: true,
                                            forwardedNewsletterMessageInfo: NEWSLETTER
                                        }
                                    }, { quoted: dlMsg });

                                } else {
                                    // ===== Direct download =====
                                    if (!dlData.directLink) {
                                        return await conn.sendMessage(from, {
                                            text: `❌ Direct download link not available!\nTry option *2* (Telegram) instead.`
                                        }, { quoted: dlMsg });
                                    }

                                    await conn.sendMessage(from, {
                                        text: `⬇️ *Downloading...*\n\n🎬 *${dlData.cartoon.title}*\n\nPlease wait, this may take a few minutes...`
                                    }, { quoted: dlMsg });

                                    const tempDir = path.join(__dirname, 'temp');
                                    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

                                    const unique = Date.now();
                                    const videoPath = path.join(tempDir, `cartoon_${unique}.mp4`);

                                    const videoRes = await axios.get(dlData.directLink.direct_url, {
                                        responseType: 'arraybuffer',
                                        timeout: 180000,
                                        maxContentLength: Infinity,
                                        maxBodyLength: Infinity,
                                        headers: {
                                            'Referer': 'https://sinhalacartoons.com/',
                                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                        }
                                    });

                                    fs.writeFileSync(videoPath, Buffer.from(videoRes.data));

                                    await conn.sendMessage(from, {
                                        video: fs.readFileSync(videoPath),
                                        mimetype: 'video/mp4',
                                        fileName: `${dlData.cartoon.title}.mp4`,
                                        caption:
                                            `🎬 *${dlData.cartoon.title}*\n\n` +
                                            `_Powered by ᴍᴇᴢᴜᴋᴀ ᴍᴅ_ 🖤`,
                                        contextInfo: {
                                            forwardingScore: 1000,
                                            isForwarded: true,
                                            forwardedNewsletterMessageInfo: NEWSLETTER
                                        }
                                    }, { quoted: dlMsg });

                                    try { fs.unlinkSync(videoPath); } catch {}

                                    await conn.sendMessage(from, {
                                        react: { text: '✅', key: mek.key }
                                    });
                                }
                            }
                        } catch (err) {
                            console.error('Cartoon download error:', err);
                            await conn.sendMessage(from, {
                                text: `❌ Download failed!\n\n${err.message}\n\nTry option *2* (Telegram) instead.`
                            });
                        }
                    };

                    conn.ev.on('messages.upsert', downloadListener);
                    setTimeout(() => {
                        conn.ev.off('messages.upsert', downloadListener);
                        delete global.cartoonDownloads?.[detailMsgID];
                    }, 5 * 60 * 1000);
                }
            } catch (err) {
                console.error('Cartoon selection error:', err);
                await conn.sendMessage(from, { text: `❌ Error: ${err.message}` });
            }
        };

        conn.ev.on('messages.upsert', replyListener);
        setTimeout(() => {
            conn.ev.off('messages.upsert', replyListener);
            delete global.cartoonSessions?.[messageID];
        }, 5 * 60 * 1000);

    } catch (e) {
        console.error('Cartoon command error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ *Error!*\n\n${e.message || 'Please try again later.'}`);
    }

    }
};
