// ============================================================
// COMMAND: song
// MEZUKA MD V5 - command/song.js
// API: https://youtube-scrap-7v51.onrender.com
// ============================================================

module.exports = {
    name: "song",
    aliases: ["music", "ytmp3", "yt"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        const yts    = require('yt-search');
        const axios  = require('axios');
        const ffmpeg = require('fluent-ffmpeg');
        const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
        const path   = require('path');
        const osModule = require('os');
        const fs     = require('fs');
        const crypto = require('crypto');

        ffmpeg.setFfmpegPath(ffmpegInstaller.path);

        // ── Custom API ──────────────────────────────────────────────
        const YT_API = 'https://youtube-scrap-ecru.vercel.app';

        const songQuery = args.join(" ").trim();

        if (!songQuery) {
            return reply(`꒰ᵎ 🎵 *Song Downloader* ᵎ꒱

⚠️ Please provide a song name!

📌 *Usage:* ${prefix}song <song name>
📌 *Example:* ${prefix}song Shape of You

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        await m.react('🔍');

        // ── YouTube Search ──────────────────────────────────────────
        const search = await yts(songQuery);
        if (!search?.videos?.length) {
            return reply(`꒰ᵎ 🎵 *Song Downloader* ᵎ꒱

❌ No results found for *${songQuery}*!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const video    = search.videos[0];
        const sUrl     = video.url;
        const sMetadata = video;

        const videoId  = sUrl.split('v=')[1]?.split('&')[0] || sUrl.split('youtu.be/')[1]?.split('?')[0];
        const thumbUrl = videoId
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : sMetadata.thumbnail;

        // ── Fetch MP3 link from custom API ──────────────────────────
        let sDownloadUrl = null;
        let sTitle       = sMetadata.title || 'Song';

        try {
            const apiResp = await axios.get(`${YT_API}/api/mp3?url=${encodeURIComponent(sUrl)}`, {
                timeout: 30000
            });
            if (apiResp.data?.status && apiResp.data?.url) {
                sDownloadUrl = apiResp.data.url;
                sTitle       = apiResp.data.title || sTitle;
            }
        } catch (e) {
            console.log('[song] API error:', e.message);
        }

        if (!sDownloadUrl) {
            return reply(`꒰ᵎ 🎵 *Song Downloader* ᵎ꒱

❌ Download failed! API unavailable.

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // ── Send thumbnail + format selection ───────────────────────
        const caption = `꒰ᵎ 🎵 *Song Downloader* ᵎ꒱

🎶 *Title* ➜ ${sTitle}
⏱️ *Duration* ➜ ${sMetadata.timestamp || 'N/A'}
👁️ *Views* ➜ ${sMetadata.views?.toLocaleString() || 'N/A'}
🔗 *URL* ➜ ${sUrl}

✨ *Select your format!*

　1️⃣ ➜ 🎵 MP3 File
　2️⃣ ➜ 🎤 Voice Message
　3️⃣ ➜ 📄 Document

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
> 💬 *Reply 1, 2 or 3* 👆`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: thumbUrl },
            caption,
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

        // ── Wait for user reply (60s) ───────────────────────────────
        const collected = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(null), 60000);
            const listener = ({ messages }) => {
                for (const m2 of messages) {
                    const isReply  = m2.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
                    const text     = (m2.message?.conversation || m2.message?.extendedTextMessage?.text || '').trim();
                    const isValid  = ['1', '2', '3'].includes(text);
                    const isSame   = m2.key.remoteJid === from;
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

> Please use *${prefix}song* command again 🌸

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
            }, { quoted: sentMsg });
        }

        const choice      = (collected.message?.conversation || collected.message?.extendedTextMessage?.text || '').trim();
        const formatLabel = choice === '1' ? 'MP3 🎵' : choice === '2' ? 'Voice Message 🎤' : 'Document 📄';

        await conn.sendMessage(from, {
            text: `꒰ᵎ 📥 *Downloading* ᵎ꒱

⏳ Processing *${formatLabel}*...
🎶 *${sTitle}*

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚`
        }, { quoted: collected });

        // ── Temp files ──────────────────────────────────────────────
        const _id    = crypto.randomBytes(8).toString('hex');
        const tmpMp3  = path.join(osModule.tmpdir(), `song_${_id}.mp3`);
        const tmpTag  = path.join(osModule.tmpdir(), `tag_${_id}.mp3`);
        const tmpOpus = path.join(osModule.tmpdir(), `song_${_id}.opus`);
        const tmpOut  = path.join(osModule.tmpdir(), `song_out_${_id}.mp3`);

        // ── Download MP3 ────────────────────────────────────────────
        const dlResp = await axios.get(sDownloadUrl, {
            responseType: 'stream',
            timeout: 120000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }).catch(() => null);

        if (!dlResp?.data) {
            return conn.sendMessage(from, {
                text: `꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ Download failed!\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
            }, { quoted: collected });
        }

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(tmpMp3);
            dlResp.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // ── Watermark download ──────────────────────────────────────
        try {
            const tagText  = "Powered by Mezuka MD WhatsApp Bot";
            const sTagUrl  = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(tagText)}&tl=en&client=tw-ob`;
            const tagResp  = await axios.get(sTagUrl, { responseType: 'stream' }).catch(() => null);
            if (tagResp) {
                await new Promise((resolve) => {
                    const writer = fs.createWriteStream(tmpTag);
                    tagResp.data.pipe(writer);
                    writer.on('finish', resolve);
                    writer.on('error', () => resolve());
                });
            }
        } catch (e) {}

        // ── FFmpeg mix helper ───────────────────────────────────────
        const mixWithWatermark = (inputFile, outputFile, format, codec) => {
            return new Promise((resolve, reject) => {
                let ff = ffmpeg(inputFile).noVideo();
                if (fs.existsSync(tmpTag)) {
                    ff.input(tmpTag).complexFilter([
                        '[1:a]adelay=1000|1000,volume=2.0[tag]',
                        '[0:a][tag]amix=inputs=2:duration=first'
                    ]);
                }
                ff.audioCodec(codec)
                    .format(format)
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputFile);
            });
        };

        // newsletter contextInfo
        const nlCtx = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        };

        // ── Send based on choice ────────────────────────────────────
        if (choice === '1') {
            // MP3 audio file
            await mixWithWatermark(tmpMp3, tmpOut, 'mp3', 'libmp3lame');
            const buf = fs.readFileSync(tmpOut);
            await conn.sendMessage(from, {
                audio: buf,
                mimetype: 'audio/mpeg',
                fileName: `${sTitle}.mp3`,
                ptt: false,
                contextInfo: nlCtx
            }, { quoted: collected });

        } else if (choice === '2') {
            // Voice note (opus)
            await mixWithWatermark(tmpMp3, tmpOpus, 'opus', 'libopus');
            const buf = fs.readFileSync(tmpOpus);
            await conn.sendMessage(from, {
                audio: buf,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true,
                contextInfo: nlCtx
            }, { quoted: collected });

        } else if (choice === '3') {
            // Document
            await mixWithWatermark(tmpMp3, tmpOut, 'mp3', 'libmp3lame');
            const buf = fs.readFileSync(tmpOut);
            await conn.sendMessage(from, {
                document: buf,
                mimetype: 'audio/mpeg',
                fileName: `${sTitle}.mp3`,
                contextInfo: nlCtx
            }, { quoted: collected });
        }

        await m.react('🎵');

    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱

⚠️ ${e.message}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('[song] Error:', e);
    } finally {
        // ── Cleanup temp files ──────────────────────────────────────
        try {
            const fs2  = require('fs');
            const os2  = require('os');
            const p2   = require('path');
            ['song_', 'tag_', 'song_out_'].forEach(pre => {
                fs2.readdirSync(os2.tmpdir())
                   .filter(f => f.startsWith(pre))
                   .forEach(f => { try { fs2.unlinkSync(p2.join(os2.tmpdir(), f)); } catch(e) {} });
            });
        } catch (e) {}
    }

    }
};
