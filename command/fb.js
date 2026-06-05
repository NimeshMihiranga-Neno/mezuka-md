// ============================================================
// COMMAND: fb
// MEZUKA MD V5 - command/fb.js
// ============================================================

module.exports = {
    name: "fb",
    aliases: ["fbdl", "facebook", "fbd"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        const axios = require('axios');

        const url = args[0];
        if (!url) {
            return reply(`꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

⚠️ Please provide a Facebook link!

📌 *Usage:* ${prefix}fb <url>
📌 *Example:* ${prefix}fb https://fb.watch/xxx

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
            return reply(`꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

❌ Please provide a valid Facebook link!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        await m.react('⏳');

        const { data } = await axios.get(
            `https://www.movanest.xyz/v2/fbdown?url=${encodeURIComponent(url)}`,
            { timeout: 15000 }
        );

        if (!data.status || !data.results || !data.results.length) {
            return reply(`꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

❌ Failed to fetch video info!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const video = data.results[0];
        const title = video.title || 'Facebook Video';
        const thumbnail = require('../image').FB_CMD;
        const duration = video.duration || 'Unknown';
        const sdLink = video.normalQualityLink;
        const hdLink = video.hdQualityLink || sdLink;

        if (!sdLink && !hdLink) {
            return reply(`꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

❌ No download links found!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const caption = `꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

🎥 *Title* ➜ ${title}
⏱️ *Duration* ➜ ${duration}

✨ *Select your quality!*

　1️⃣ ➜ SD Quality
　2️⃣ ➜ HD Quality

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
> 💬 *Reply 1 or 2* 👆`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: caption,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

        await m.react('✅');

        const collected = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(null), 60000);

            const listener = ({ messages }) => {
                for (const m2 of messages) {
                    const isReply = m2.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
                    const text = (m2.message?.conversation || m2.message?.extendedTextMessage?.text || '').trim();
                    const isValid = ['1', '2'].includes(text);
                    const isSame = m2.key.remoteJid === from;

                    if (isReply && isValid && isSame) {
                        clearTimeout(timeout);
                        conn.ev.off('messages.upsert', listener);
                        resolve(m2);
                    }
                }
            };

            conn.ev.on('messages.upsert', listener);
        });

        if (!collected) {
            return conn.sendMessage(from, {
                text: `꒰ᵎ ⏰ *Time Out* ᵎ꒱

⌛ 60 seconds expired!

> Please use *${prefix}fb* command again 🌸

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
            }, { quoted: sentMsg });
        }

        const choice = (collected.message?.conversation || collected.message?.extendedTextMessage?.text || '').trim();
        const downloadLink = choice === '2' ? hdLink : sdLink;
        const qualityLabel = choice === '2' ? 'HD 🎯' : 'SD 📱';

        await conn.sendMessage(from, {
            text: `꒰ᵎ 📥 *Downloading* ᵎ꒱

⏳ Downloading *${qualityLabel}* video...
🎥 *${title}*

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚`
        }, { quoted: collected });

        await conn.sendMessage(from, {
            video: { url: downloadLink },
            caption: `꒰ᵎ 🎬 *FB Downloader* ᵎ꒱

✅ *Download Complete!*

🎥 *Title* ➜ ${title}
📊 *Quality* ➜ ${qualityLabel}
⏱️ *Duration* ➜ ${duration}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: collected });

        await m.react('🎬');

    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱

⚠️ ${e.message}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('FB DL Error:', e);
    }

    }
};
