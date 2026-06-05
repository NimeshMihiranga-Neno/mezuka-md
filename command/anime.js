// ============================================================
// COMMAND: anime / asearch
// MEZUKA MD V5 - command/anime.js
// ============================================================

module.exports = {
    name: "anime",
    aliases: ["asearch"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        

        await m.react('⤵️');

        if (!q) return reply("please give me anime name.\n\nExample: .anime Naruto");

        await conn.sendMessage(from, { text: `\n\n✰𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹✰ 𝙰𝙽𝙸𝙼𝙴 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶.....` });
        await m.react('⤴️');

        const BASE_API = "https://api-multi-sandy.vercel.app/api";

        const searchResponse = await axios.get(`${BASE_API}/anime`, {
            params: { name: q },
            timeout: 15000
        });

        const searchResult = searchResponse.data;

        if (!searchResult.success || !searchResult.results || searchResult.results.length === 0) {
            return reply("❌ No anime found!");
        }

        const anime = searchResult.results.find(r => r.logo !== null) || searchResult.results[0];
        const animeUrl = anime.url;
        const animeTitle = anime.title;
        const animeImage = anime.logo || require('../image').AEEO1I;

        const episodesResponse = await axios.get(`${BASE_API}/episodes`, {
            params: { url: animeUrl },
            timeout: 20000
        });

        const episodesResult = episodesResponse.data;

        if (!episodesResult.success || !episodesResult.episodes || episodesResult.episodes.length === 0) {
            return reply("❌ Failed to get episodes!");
        }

        const episodes = episodesResult.episodes;
        const totalEpisodes = episodes.length;
        const displayEpisodes = episodes.slice(0, 50);

        let episodeMsg = `
❍ 𝙰𝙽𝙸𝙼𝙴 𝙴𝙿𝙸𝚂𝙾𝙳𝙴𝚂
  ❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮

📺 *${animeTitle}*
📊 Total Episodes: ${totalEpisodes}

`;

        displayEpisodes.forEach((ep, index) => {
            episodeMsg += `❍ ${index + 1}┊ ❮ *${ep.name}* ❯\n`;
        });

        if (totalEpisodes > 50) {
            episodeMsg += `\n_... and ${totalEpisodes - 50} more episodes_\n`;
        }

        episodeMsg += `\n* \`📩 Reply Episode Number\`\n\n${GQCAP}`;

        const vvvvv = await conn.sendMessage(from, {
            image: { url: animeImage },
            caption: episodeMsg
        }, { quoted: adhiqmini });

        global.animeDownloads = global.animeDownloads || {};
        global.animeDownloads[vvvvv.key.id] = {
            animeTitle,
            animeImage,
            episodes,
            sender: from
        };

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === vvvvv.key.id) {

                await conn.sendMessage(from, { react: { text: '⬇️', key: msg.key } });

                const episodeNumber = parseInt(selectedOption);
                const animeData = global.animeDownloads[vvvvv.key.id];

                if (isNaN(episodeNumber) || episodeNumber < 1) {
                    return reply("Invalid episode number.");
                }

                if (episodeNumber > animeData.episodes.length) {
                    return reply(`❌ Invalid! Max episodes: ${animeData.episodes.length}`);
                }

                const selectedEpisode = animeData.episodes[episodeNumber - 1];

                await conn.sendMessage(from, {
                    text: `⏳ Preparing Episode ${episodeNumber} - ${selectedEpisode.name}...`
                });

                const downloadResponse = await axios.get(`${BASE_API}/animedl`, {
                    params: { url: selectedEpisode.url },
                    timeout: 20000
                });

                const downloadResult = downloadResponse.data;

                if (!downloadResult.success || !downloadResult.downloads || downloadResult.downloads.length === 0) {
                    return reply("❌ No download links found!");
                }

                const downloadLink = downloadResult.downloads[0].link;
                const fileIdMatch = downloadLink.match(/\/d\/([^\/]+)/);
                if (!fileIdMatch) return reply("❌ Invalid download link!");

                const fileId = fileIdMatch[1];
                const unique = Date.now();
                const tempDir = path.join(__dirname, 'temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

                const cookiesPath = path.join(tempDir, `cookies_${unique}.txt`);
                const videoPath = path.join(tempDir, `anime_${unique}.mp4`);

                await conn.sendMessage(from, { text: `⬇️ Downloading from Google Drive...` });

                await execPromise(`curl -c "${cookiesPath}" -s -L "https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0" > /dev/null`);

                await execPromise(
                    `curl -L -b "${cookiesPath}" -o "${videoPath}" "https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0&confirm=t"`,
                    { maxBuffer: 1024 * 1024 * 100 }
                );

                if (!fs.existsSync(videoPath)) return reply("❌ Download failed!");

                const stats = fs.statSync(videoPath);
                const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

                if (stats.size < 1000000) return reply("❌ Download failed - file too small!");

                await conn.sendMessage(from, { text: `📤 Uploading... Size: ${fileSizeMB} MB` });

                const thumbBuffer = await axios.get(animeData.animeImage, { responseType: 'arraybuffer' })
                    .then(res => Buffer.from(res.data));

                await conn.sendMessage(from, {
                    document: fs.readFileSync(videoPath),
                    mimetype: 'video/mp4',
                    fileName: `${animeData.animeTitle} - Episode ${episodeNumber}.mp4`,
                    caption: `
❍ 𝙰𝙽𝙸𝙼𝙴 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳
  ❯❯❯❯❯❯❯❯❯❯❯❮❮❮❮❮❮❮❮❮❮❮

🎌 *${animeData.animeTitle}*
📺 Episode: ${episodeNumber}
📌 ${selectedEpisode.name}
💾 Size: ${fileSizeMB} MB

${GQCAP}`,
                    jpegThumbnail: thumbBuffer
                }, { quoted: adhiqmini });

                try {
                    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                    if (fs.existsSync(cookiesPath)) fs.unlinkSync(cookiesPath);
                    delete global.animeDownloads[vvvvv.key.id];
                } catch (err) {}

                await conn.sendMessage(from, { react: { text: '⬆️', key: msg.key } });
            }
        });

        setTimeout(() => {
            delete global.animeDownloads[vvvvv.key.id];
        }, 10 * 60 * 1000);

    } catch (e) {
        reply(e.message);
    }

    }
};
