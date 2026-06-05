// ============================================================
// COMMAND: video / vid / v
// MEZUKA MD V5 - command/video.js
// API: https://youtube-scrap-7v51.onrender.com
// ============================================================

module.exports = {
    name: "video",
    aliases: ["vid", "v"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');
    const fs    = require('fs');
    const path  = require('path');
    const yts   = require('yt-search');

    // ── API ────────────────────────────────────────────────────
    const YT_API = 'https://pacific-plains-35669-22457701905f.herokuapp.com';

    // ── Helpers ────────────────────────────────────────────────
    const isYtUrl = (str) => str && (str.includes('youtube.com') || str.includes('youtu.be'));

    const extractId = (url) => {
        const m1 = url.match(/(?:v=)([a-zA-Z0-9_-]{11})/);
        const m2 = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const m3 = url.match(/(?:shorts\/)([a-zA-Z0-9_-]{11})/);
        return (m1||m2||m3)?.[1] || null;
    };

    // quality label → display name
    const Q_LABELS = {
        'mp3':'🎵 MP3 Audio',
        '144':'📱 144p',
        '240':'📱 240p',
        '360':'📺 360p',
        '480':'📺 480p',
        '720':'🎬 720p HD',
        '1080':'🎬 1080p FHD',
        '1440':'🎬 1440p 2K',
        '2160':'🎬 2160p 4K',
    };

    // waitForReply: listen for a reply to a specific message
    const waitForReply = (targetMsgId, validOptions, timeoutMs = 60000) => {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                conn.ev.off('messages.upsert', listener);
                resolve(null);
            }, timeoutMs);

            const listener = ({ messages }) => {
                for (const msg of messages) {
                    const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === targetMsgId;
                    const text    = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
                    const isSame  = msg.key.remoteJid === from;
                    if (isReply && isSame && validOptions.includes(text)) {
                        clearTimeout(timer);
                        conn.ev.off('messages.upsert', listener);
                        resolve({ text, msg });
                    }
                }
            };
            conn.ev.on('messages.upsert', listener);
        });
    };

    try {
        await m.react('🔍');

        if (!q) return reply(
            `꒰ᵎ 🎬 *Video Downloader* ᵎ꒱\n\n` +
            `📌 *Usage:*\n` +
            `   ${prefix}video <YouTube URL>\n` +
            `   ${prefix}video <search query>\n\n` +
            `📌 *Examples:*\n` +
            `   ${prefix}video https://youtu.be/dQw4w9WgXcQ\n` +
            `   ${prefix}video Shape of You\n\n` +
            `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n` +
            `*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
        );

        let videoUrl  = null;
        let videoMeta = null;

        // ════════════════════════════════════════════════════════
        // MODE A: Direct YouTube URL
        // ════════════════════════════════════════════════════════
        if (isYtUrl(q)) {
            videoUrl = q.trim();

        // ════════════════════════════════════════════════════════
        // MODE B: Search query → show top 10
        // ════════════════════════════════════════════════════════
        } else {
            const search = await yts(q);
            if (!search?.videos?.length) {
                return reply(
                    `꒰ᵎ 🎬 *Video Downloader* ᵎ꒱\n\n` +
                    `❌ No results found for *${q}*!\n\n` +
                    `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n` +
                    `*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
                );
            }

            const results = search.videos.slice(0, 10);

            // Build results list
            let resultMsg = `꒰ᵎ 🔎 *Search Results* ᵎ꒱\n\n🔍 *${q}*\n\n`;
            results.forEach((v, i) => {
                resultMsg += `*${i + 1}.* ${v.title}\n`;
                resultMsg += `     ⏱ ${v.timestamp}  👁 ${v.views?.toLocaleString() || 'N/A'}  👤 ${v.author?.name || 'N/A'}\n\n`;
            });
            resultMsg += `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n> 💬 *Reply 1-${results.length} to select*`;

            const searchMsg = await conn.sendMessage(from, {
                text: resultMsg,
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

            // Wait for search selection
            const validNums = results.map((_, i) => String(i + 1));
            const picked    = await waitForReply(searchMsg.key.id, validNums, 60000);

            if (!picked) {
                return conn.sendMessage(from, {
                    text: `꒰ᵎ ⏰ *Time Out* ᵎ꒱\n\n⌛ 60s expired! Use *${prefix}video* again.\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
                }, { quoted: searchMsg });
            }

            const chosen = results[parseInt(picked.text) - 1];
            videoUrl  = chosen.url;
            videoMeta = {
                title:     chosen.title,
                thumbnail: chosen.thumbnail,
                duration:  chosen.timestamp,
                views:     chosen.views,
                author:    chosen.author?.name || 'Unknown',
            };

            await conn.sendMessage(from, {
                react: { text: '✅', key: picked.msg.key }
            });
        }

        // ════════════════════════════════════════════════════════
        // FETCH INFO from our API
        // ════════════════════════════════════════════════════════
        await conn.sendMessage(from, {
            text: `꒰ᵎ ⏳ *Fetching Info...* ᵎ꒱\n\n🔗 ${videoUrl}\n\nPlease wait...`
        }, { quoted: adhiqmini });

        let apiInfo = null;
        try {
            const infoResp = await axios.get(`${YT_API}/api/info?url=${encodeURIComponent(videoUrl)}`, {
                timeout: 20000
            });
            if (infoResp.data?.status) apiInfo = infoResp.data;
        } catch (e) {
            console.log('[video] info fetch error:', e.message);
        }

        // fallback metadata from yts if no API info
        if (!videoMeta && apiInfo) {
            videoMeta = {
                title:     apiInfo.title,
                thumbnail: apiInfo.thumbnail,
                duration:  'N/A',
                views:     'N/A',
                author:    apiInfo.author || 'Unknown',
            };
        }
        if (!videoMeta) {
            try {
                const vid = await yts({ videoId: extractId(videoUrl) });
                videoMeta = {
                    title:     vid.title,
                    thumbnail: vid.thumbnail,
                    duration:  vid.timestamp,
                    views:     vid.views,
                    author:    vid.author?.name || 'Unknown',
                };
            } catch(e) {}
        }

        const title     = videoMeta?.title     || apiInfo?.title     || 'Unknown';
        const thumbnail = videoMeta?.thumbnail || apiInfo?.thumbnail || null;
        const duration  = videoMeta?.duration  || 'N/A';
        const views     = videoMeta?.views;
        const author    = videoMeta?.author    || 'Unknown';

        // Available qualities from API
        const rawQualities = apiInfo?.available_qualities || ['360','720','1080','mp3'];

        // Build quality list (mp3 first, then video qualities high→low)
        const videoQuals = rawQualities
            .filter(q => q !== 'mp3')
            .sort((a, b) => parseInt(b) - parseInt(a));
        const orderedQualities = ['mp3', ...videoQuals];

        // Build quality menu
        let qualityText = `꒰ᵎ 🎬 *Video Info* ᵎ꒱\n\n`;
        qualityText += `🎞️ *Title* ➜ ${title}\n`;
        qualityText += `⏱️ *Duration* ➜ ${duration}\n`;
        qualityText += `👁️ *Views* ➜ ${views ? (typeof views === 'number' ? views.toLocaleString() : views) : 'N/A'}\n`;
        qualityText += `👤 *Channel* ➜ ${author}\n\n`;
        qualityText += `✨ *Select Quality:*\n\n`;
        orderedQualities.forEach((q, i) => {
            qualityText += `　*${i + 1}.* ${Q_LABELS[q] || q + 'p'}\n`;
        });
        qualityText += `\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n> 💬 *Reply 1-${orderedQualities.length}*`;

        const infoMsg = await conn.sendMessage(from, {
            image: { url: thumbnail || `https://img.youtube.com/vi/${extractId(videoUrl)}/maxresdefault.jpg` },
            caption: qualityText,
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

        // Wait for quality selection
        const validQualNums = orderedQualities.map((_, i) => String(i + 1));
        const qualPicked    = await waitForReply(infoMsg.key.id, validQualNums, 60000);

        if (!qualPicked) {
            return conn.sendMessage(from, {
                text: `꒰ᵎ ⏰ *Time Out* ᵎ꒱\n\n⌛ 60s expired! Use *${prefix}video* again.\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
            }, { quoted: infoMsg });
        }

        const selectedQuality = orderedQualities[parseInt(qualPicked.text) - 1];
        const isMp3           = selectedQuality === 'mp3';

        await conn.sendMessage(from, { react: { text: '⬇️', key: qualPicked.msg.key } });

        await conn.sendMessage(from, {
            text: `꒰ᵎ 📥 *Downloading* ᵎ꒱\n\n⏳ *${Q_LABELS[selectedQuality] || selectedQuality}*\n🎬 *${title}*\n\nPlease wait...`
        }, { quoted: qualPicked.msg });

        // ════════════════════════════════════════════════════════
        // FETCH DOWNLOAD URL
        // ════════════════════════════════════════════════════════
        let downloadUrl = null;
        try {
            if (isMp3) {
                const r = await axios.get(`${YT_API}/api/mp3?url=${encodeURIComponent(videoUrl)}`, { timeout: 25000 });
                if (r.data?.status) downloadUrl = r.data.url;
            } else {
                const r = await axios.get(`${YT_API}/api/video?url=${encodeURIComponent(videoUrl)}&q=${selectedQuality}`, { timeout: 25000 });
                if (r.data?.status) downloadUrl = r.data.url;
            }
        } catch (e) {
            console.log('[video] download url fetch error:', e.message);
        }

        if (!downloadUrl) {
            return conn.sendMessage(from, {
                text: `꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ Download link not found!\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
            }, { quoted: qualPicked.msg });
        }

        // ════════════════════════════════════════════════════════
        // DOWNLOAD FILE
        // ════════════════════════════════════════════════════════
        const unique  = Date.now();
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const ext      = isMp3 ? 'mp3' : 'mp4';
        const filePath = path.join(tempDir, `video_${unique}.${ext}`);

        const dlResp = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout: 300000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        fs.writeFileSync(filePath, Buffer.from(dlResp.data));

        const nlCtx = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        };

        const caption = `꒰ᵎ 🎬 *${isMp3 ? 'Audio' : 'Video'} Downloaded* ᵎ꒱\n\n🎞️ *${title}*\n👤 *${author}*\n✨ *${Q_LABELS[selectedQuality] || selectedQuality}*\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

        // ════════════════════════════════════════════════════════
        // SEND FILE
        // ════════════════════════════════════════════════════════
        if (isMp3) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(filePath),
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                ptt: false,
                contextInfo: nlCtx
            }, { quoted: qualPicked.msg });
        } else {
            await conn.sendMessage(from, {
                video: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                caption,
                contextInfo: nlCtx
            }, { quoted: qualPicked.msg });
        }

        // Cleanup
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}

        await conn.sendMessage(from, { react: { text: '✅', key: qualPicked.msg.key } });

    } catch (e) {
        reply(
            `꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
        );
        console.log('[video] Error:', e);
    }

    }
};
