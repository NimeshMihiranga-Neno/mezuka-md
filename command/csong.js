// ============================================================

// COMMAND: csong

// MEZUKA MD V5 - command/csong.js

// API: https://youtube-scrap-7v51.onrender.com

// ============================================================



module.exports = {

    name: "csong",

    aliases: ["cs"],

    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {



    try {

        const axios   = require('axios');

        const yts     = require('yt-search');

        const fs      = require('fs');

        const path    = require('path');

        const ffmpeg  = require('fluent-ffmpeg');

        const ffmpegPath = require('ffmpeg-static');

        ffmpeg.setFfmpegPath(ffmpegPath);



        // ── Custom API ──────────────────────────────────────────────

        const YT_API = 'https://youtube-scrap-ecru.vercel.app';



        // ── Usage check ─────────────────────────────────────────────

        if (!args || args.length < 2) {

            return reply(

                `❌ *Usage:*\n\n` +

                `*.csong <channel_jid> <song name>*\n\n` +

                `Example:\n` +

                `*.csong 120363424190766692@newsletter Shape of You*`

            );

        }



        const channelJid = args[0];

        const songQuery  = args.slice(1).join(' ');



        if (!channelJid.endsWith('@newsletter')) {

            return reply(`❌ Invalid channel JID!\n\nChannel JID must end with *@newsletter*\n\nExample: \`120363424190766692@newsletter\``);

        }



        if (!songQuery) {

            return reply(`❌ Please provide a song name!\n\nExample:\n*.csong 120363424190766692@newsletter Shape of You*`);

        }



        await reply(`🔍 *Searching...*\n\n*${songQuery}*\n\nPlease wait...`);



        // ── YouTube Search ──────────────────────────────────────────

        const searchResult = await yts(songQuery);

        if (!searchResult.videos.length) {

            return reply(`❌ No results found!\n\nප්‍රතිඵල හමු නොවිණි!`);

        }



        const video    = searchResult.videos[0];

        const videoUrl = video.url;

        const title    = video.title;

        const duration = video.timestamp;

        const thumbnail= video.thumbnail;

        const views    = video.views;

        const author   = video.author?.name || 'Unknown';

        const ago      = video.ago || '';



        // ── Fetch MP3 from custom API ───────────────────────────────

        let downloadUrl = null;

        try {

            const apiResp = await axios.get(`${YT_API}/api/mp3?url=${encodeURIComponent(videoUrl)}`, {

                timeout: 30000

            });

            if (apiResp.data?.status && apiResp.data?.url) {

                downloadUrl = apiResp.data.url;

            }

        } catch (e) {

            console.log('[csong] API error:', e.message);

        }



        if (!downloadUrl) {

            return reply(`❌ Download link not found!\n\nDownload link හමු නොවිණි!`);

        }



        await reply(`✅ *Found! Converting & Sending to channel...*\n\nකරුණාකර රැඳෙන්න... 🎵`);



        // ── Temp dir ────────────────────────────────────────────────

        const unique  = Date.now();

        const tempDir = path.join(__dirname, 'temp');

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });



        const mp3Path   = path.join(tempDir, `csong_${unique}.mp3`);

        const introPath = path.join(tempDir, `intro_${unique}.mp3`);

        const mixPath   = path.join(tempDir, `mix_${unique}.mp3`);

        const opusPath  = path.join(tempDir, `csong_${unique}.ogg`); // must be .ogg, not .opus, for WA to accept it as a voice note



        // ── Download main MP3 ───────────────────────────────────────

        const audioResponse = await axios.get(downloadUrl, {

            responseType: 'arraybuffer',

            timeout: 120000,

            maxContentLength: Infinity,

            maxBodyLength: Infinity,

            headers: { 'User-Agent': 'Mozilla/5.0' }

        });

        fs.writeFileSync(mp3Path, Buffer.from(audioResponse.data));



        // ── Download "Powered by Mezuka MD" intro (TTS) ─────────────

        let hasIntro = false;

        try {

            const introText = "Powered by Mezuka MD WhatsApp Bot";

            const ttsUrl    = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(introText)}&tl=en&client=tw-ob`;

            const introResp = await axios.get(ttsUrl, {

                responseType: 'arraybuffer',

                timeout: 15000

            });

            fs.writeFileSync(introPath, Buffer.from(introResp.data));

            hasIntro = true;

        } catch (e) {

            console.log('[csong] TTS intro skip:', e.message);

        }



        // ── FFmpeg: prepend intro + convert to opus ─────────────────

        await new Promise((resolve, reject) => {

            if (hasIntro) {

                ffmpeg()

                    .input(introPath)

                    .input(mp3Path)

                    .complexFilter([

                        '[0:a]volume=2.0[intro]',

                        '[1:a]volume=1.0[song]',

                        '[intro][song]concat=n=2:v=0:a=1[out]'

                    ])

                    .outputOptions(['-map [out]'])

                    .audioCodec('libmp3lame')

                    .format('mp3')

                    .on('end', resolve)

                    .on('error', reject)

                    .save(mixPath);

            } else {

                fs.copyFileSync(mp3Path, mixPath);

                resolve();

            }

        });



        await new Promise((resolve, reject) => {

            ffmpeg(mixPath)

                .audioChannels(1)            // WA voice notes must be mono

                .audioFrequency(48000)       // standard WA opus sample rate

                .audioBitrate(64)

                .audioCodec('libopus')

                .outputOptions(['-avoid_negative_ts', 'make_zero'])

                .format('ogg')               // OGG/Opus container — NOT raw 'opus'

                .on('end', resolve)

                .on('error', reject)

                .save(opusPath);

        });



        // ── Channel message ─────────────────────────────────────────

        const cuteMsg =

`🌸 𝑵𝒐𝒘 𝑷𝒍𝒂𝒚𝒊𝒏𝒈 🌸



🎶 𝑻𝒊𝒕𝒍𝒆 : ${title}



⏱ 𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏 : ${duration || 'Unknown'}

👁 𝑽𝒊𝒆𝒘𝒔 : ${views ? views.toLocaleString() : 'Unknown'}

👤 𝑪𝒉𝒂𝒏𝒏𝒆𝒍 : ${author}

🕒 𝑼𝒑𝒍𝒐𝒂𝒅𝒆𝒅 : ${ago}



🔗 ${videoUrl}



✨ 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝒎𝒖𝒔𝒊𝒄 🎧

> ★彡 𝐿𝒪𝒱𝐸𝐿𝒰 𝒱𝐼𝐵𝐸 🧃🌸 彡★`;



        // ── Send thumbnail + caption to channel ─────────────────────

        const imgResult = await conn.sendMessage(channelJid, {

            image: { url: thumbnail || require('../image').IBB_LOGO },

            caption: cuteMsg

        });

        console.log('[csong] image sent, id:', imgResult?.key?.id);



        // small delay — sending two messages back-to-back to a newsletter

        // too fast can cause the second one to be dropped silently on

        // some Baileys versions

        await new Promise(r => setTimeout(r, 1500));



        // ── Send voice note (opus with intro) to channel ────────────

        const audioBuffer = fs.readFileSync(opusPath);

        console.log('[csong] audio buffer size:', audioBuffer.length, 'bytes ->', opusPath);



        const audioResult = await conn.sendMessage(channelJid, {

            audio: audioBuffer,

            mimetype: 'audio/ogg; codecs=opus',

            ptt: true

        });

        console.log('[csong] audio sent, id:', audioResult?.key?.id);



        if (!audioResult?.key?.id) {

            console.log('[csong] WARNING: audio sendMessage returned no message id — likely rejected upstream by WhatsApp/newsletter');

        }



        // ── Cleanup ─────────────────────────────────────────────────

        [mp3Path, introPath, mixPath, opusPath].forEach(f => {

            try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (e) {}

        });



        // ── React + confirm ─────────────────────────────────────────

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

        reply(

            `✅ *Successfully sent to channel!*\n\n` +

            `🎵 *${title}*\n` +

            `📢 *Channel:* \`${channelJid}\`\n\n` +

            `_Channel ekata song eka successfully send una!_ 🎉`

        );



    } catch (e) {

        console.error('[csong] Error:', e);

        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });



        let errorMsg = "⚠️ *Error occurred!*\n\nවැරැද්දක් සිදු වුනා!\n\n";

        if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {

            errorMsg += "⏱️ Request timeout. Try again!\nකාලය ඉක්මවා ගියා!";

        } else {

            errorMsg += `❌ ${e.message || 'Please try again later.'}\nපසුව උත්සාහ කරන්න.`;

        }

        reply(errorMsg);

    }



    }

};

