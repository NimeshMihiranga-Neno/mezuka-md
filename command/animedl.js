// ============================================================
// COMMAND: animedl
// MEZUKA MD V5 - command/animedl.js
// ============================================================

module.exports = {
    name: "animedl",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        

        await m.react('⤵️');

        if (!q) return reply("Please give anime name.\n\nExample: .animedl Naruto");

        const API = "https://animevers.duckdns.org";

        await conn.sendMessage(from, { text: `🔍 Searching *${q}*...` });

        const searchRes = await axios.get(`${API}/search`, { params: { q }, timeout: 15000 });
        const results = searchRes.data.data.results;
        if (!results || results.length === 0) return reply("❌ Anime not found!");

        const anime = results.find(r => r.type === 'tvshows') || results[0];

        const aboutRes = await axios.get(`${API}/about`, {
            params: { type: anime.type, slug: anime.slug },
            timeout: 20000
        });

        const animeData = aboutRes.data.data;
        const allEpisodes = [];
        for (const season of animeData.seasons) {
            for (const ep of season.episodes) {
                allEpisodes.push(ep);
            }
        }

        if (allEpisodes.length === 0) return reply("❌ No episodes found!");

        const displayEps = allEpisodes.slice(0, 50);
        let epMsg = `❍ 𝘼𝙉𝙄𝙈𝙀 𝙀𝙋𝙄𝙎𝙊𝘿𝙀𝙎\n  ❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮\n\n`;
        epMsg += `📺 *${animeData.title}*\n`;
        epMsg += `⭐ Rating: ${animeData.rating}\n`;
        epMsg += `📊 Total Episodes: ${animeData.totalEpisodes}\n\n`;

        displayEps.forEach((ep, i) => {
            epMsg += `❍ ${i + 1}┊ ❮ *S${ep.season}E${ep.episode}* ❯\n`;
        });

        if (allEpisodes.length > 50) {
            epMsg += `\n_... and ${allEpisodes.length - 50} more episodes_\n`;
        }

        epMsg += `\n\`📩 Reply with Episode Number\``;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: animeData.poster || require('../image').AEEO1I },
            caption: epMsg
        }, { quoted: adhiqmini });

        global.animeDownloads = global.animeDownloads || {};
        global.animeDownloads[sentMsg.key.id] = { animeData, allEpisodes, sender: from };

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const contextId = msg.message.extendedTextMessage?.contextInfo?.stanzaId;
            if (contextId !== sentMsg.key.id) return;

            const stored = global.animeDownloads[sentMsg.key.id];
            if (!stored) return;

            const epNum = parseInt(msg.message.extendedTextMessage.text.trim());
            if (isNaN(epNum) || epNum < 1 || epNum > stored.allEpisodes.length) {
                return conn.sendMessage(from, { text: `❌ Invalid! Enter 1 - ${stored.allEpisodes.length}` });
            }

            await conn.sendMessage(from, { react: { text: '⬇️', key: msg.key } });

            const selectedEp = stored.allEpisodes[epNum - 1];
            await conn.sendMessage(from, { text: `⏳ Getting Episode S${selectedEp.season}E${selectedEp.episode}...` });

            const epRes = await axios.get(`${API}/episode`, { params: { slug: selectedEp.slug }, timeout: 20000 });
            const epData = epRes.data.data;

            if (!epData.downloads || epData.downloads.length === 0) {
                return conn.sendMessage(from, { text: '❌ No download links found!' });
            }

            const dlLink = epData.downloads.find(d => d.quality.includes('720') || d.quality.includes('HD')) || epData.downloads[0];

            const resolveRes = await axios.get(`${API}/resolve`, { params: { url: dlLink.link }, timeout: 15000 });
            const resolved = resolveRes.data.data;
            if (!resolved.url) return conn.sendMessage(from, { text: '❌ Failed to resolve download URL!' });

            const fileIdMatch = resolved.url.match(/\/d\/([^\/]+)/);
            if (!fileIdMatch) return conn.sendMessage(from, { text: '❌ Invalid Google Drive URL!' });

            const fileId = fileIdMatch[1];
            const unique = Date.now();
            const tempDir = path.join(__dirname, 'temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

            const cookiesPath = path.join(tempDir, `cookies_${unique}.txt`);
            const videoPath = path.join(tempDir, `anime_${unique}.mp4`);

            await conn.sendMessage(from, {
                text: `⬇️ Downloading *${stored.animeData.title}* S${selectedEp.season}E${selectedEp.episode}...\n💾 Quality: ${dlLink.quality}`
            });

            await execPromise(`curl -c "${cookiesPath}" -s -L "https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0" > /dev/null`);
            await execPromise(
                `curl -L -b "${cookiesPath}" -o "${videoPath}" "https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0&confirm=t"`,
                { maxBuffer: 1024 * 1024 * 500 }
            );

            if (!fs.existsSync(videoPath)) return conn.sendMessage(from, { text: '❌ Download failed!' });

            const stats = fs.statSync(videoPath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            if (stats.size < 1000000) return conn.sendMessage(from, { text: '❌ Download failed - file too small!' });

            await conn.sendMessage(from, { text: `📤 Uploading... ${sizeMB} MB` });

            const thumbBuffer = stored.animeData.poster
                ? await axios.get(stored.animeData.poster, { responseType: 'arraybuffer' }).then(r => Buffer.from(r.data))
                : null;

            await conn.sendMessage(from, {
                document: fs.readFileSync(videoPath),
                mimetype: 'video/mp4',
                fileName: `${stored.animeData.title} - S${selectedEp.season}E${selectedEp.episode}.mp4`,
                caption: `❍ 𝘼𝙉𝙄𝙈𝙀 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿\n  ❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮\n\n🎌 *${stored.animeData.title}*\n📺 S${selectedEp.season}E${selectedEp.episode}\n📌 ${epData.episodeName || ''}\n💾 Size: ${sizeMB} MB\n⭐ ${stored.animeData.rating}\n\n${GQCAP}`,
                jpegThumbnail: thumbBuffer || undefined
            }, { quoted: adhiqmini });

            try {
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                if (fs.existsSync(cookiesPath)) fs.unlinkSync(cookiesPath);
                delete global.animeDownloads[sentMsg.key.id];
            } catch (e) {}

            await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
        });

        setTimeout(() => { delete global.animeDownloads[sentMsg.key.id]; }, 10 * 60 * 1000);

        await m.react('⤴️');

    } catch (e) {
        reply(e.message);
    }

    }
};
