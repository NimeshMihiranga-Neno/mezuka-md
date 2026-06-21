// ============================================================
// COMMAND: movie
// MEZUKA MD V4 - command/movie.js
// Powered by: https://movies-one-wheat.vercel.app/  (SinhalaSub.LK scraper)
// ============================================================

module.exports = {
    name: "movie",
    aliases: ["movies", "film", "sinsub"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, adhiqmini, prefix }) {

    try {
        const axios = require('axios');

        if (!q || q.trim() === '') {
            return reply(`❌ *Movie name ekak denna!*\n\nExample: *${prefix}movie Vincenzo*`);
        }

        const MOVIE_API = "https://movies-one-wheat.vercel.app";
        const FALLBACK_BANNER = "https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/c43aaa113275aa4f2ac0c9d10c603909.jpg";
        const NEWSLETTER = {
            newsletterJid: '120363424190766692@newsletter',
            newsletterName: 'ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3',
            serverMessageId: 143
        };

        // ========== 1. SEARCH ==========
        const searchRes = await axios.get(`${MOVIE_API}/api/screech=${encodeURIComponent(q.trim())}`, { timeout: 30000 });

        if (!searchRes.data?.status || !searchRes.data.count) {
            return reply(`❌ *"${q}"* nemei movie ekak hambuna na!\n\nVenas keyword ekakin try karanna.`);
        }

        const movies = searchRes.data.results.slice(0, 10);

        let listText = `🎬 *ᶦᶰᵈ᭄ ᴍᴇᴢᴜᴋᴀ ᴍᴅ 亗*\n\n`;
        listText += `🔍 *Search Results:* ${q}\n`;
        listText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        movies.forEach((mv, i) => {
            listText += `*${i + 1}.* ${mv.title}\n`;
        });
        listText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        listText += `_Reply with a number (1-${movies.length}) to select_ ⬆️`;

        const listBanner = movies[0]?.poster || FALLBACK_BANNER;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: listBanner },
            caption: listText,
            contextInfo: {
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: NEWSLETTER
            }
        }, { quoted: adhiqmini });

        const messageID = sentMsg.key.id;

        global.movieSessions = global.movieSessions || {};
        global.movieSessions[messageID] = { movies, from, expiry: Date.now() + 5 * 60 * 1000 };

        // ========== Movie selection listener ==========
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
                    const session = global.movieSessions[messageID];

                    if (!session) {
                        await conn.sendMessage(from, {
                            text: `❌ Session expired! Use *${prefix}movie* again.`
                        }, { quoted: replyMsg });
                        conn.ev.off('messages.upsert', replyListener);
                        return;
                    }

                    if (isNaN(num) || num < 1 || num > session.movies.length) {
                        await conn.sendMessage(from, {
                            text: `❌ Invalid! Reply with a number between 1 and ${session.movies.length}.`
                        }, { quoted: replyMsg });
                        continue;
                    }

                    const selected = session.movies[num - 1];
                    conn.ev.off('messages.upsert', replyListener);
                    delete global.movieSessions[messageID];

                    await conn.sendMessage(from, {
                        text: `🔍 *Loading details...*\n\n*${selected.title}*\n\nPlease wait...`
                    }, { quoted: replyMsg });

                    // ========== 2 & 3. Fetch movie data + download links (parallel) ==========
                    let movieData, dlData;
                    try {
                        const [dRes, lRes] = await Promise.all([
                            axios.get(`${MOVIE_API}/api/data=${encodeURIComponent(selected.link)}`, { timeout: 30000 }),
                            axios.get(`${MOVIE_API}/api/dreclink=${encodeURIComponent(selected.link)}`, { timeout: 90000 })
                        ]);
                        movieData = dRes.data;
                        dlData = lRes.data;
                    } catch (err) {
                        return await conn.sendMessage(from, {
                            text: `❌ Details load karaddi error ekak une!\n\n${err.message}`
                        }, { quoted: replyMsg });
                    }

                    if (!movieData?.status) {
                        return await conn.sendMessage(from, {
                            text: `❌ Movie info load wenne nathu giya!`
                        }, { quoted: replyMsg });
                    }

                    // Hosts we don't want shown in the quality list (slow / blocked)
                    const BLOCKED_HOSTS = ['cdn.sinhalasub.net', 'filespayouts.com', 'ddl.sinhalasub.net'];

                    const downloads = (dlData?.downloads || []).filter(d => {
                        if (!d.mp4) return false;
                        const host = (d.host || '').toLowerCase();
                        return !BLOCKED_HOSTS.some(b => host.includes(b));
                    });

                    if (!downloads.length) {
                        return await conn.sendMessage(from, {
                            text: `❌ *${movieData.title}*\n\nDownload links mokuth hamba unne na. Passe try karanna.`
                        }, { quoted: replyMsg });
                    }

                    // ========== Build detail + quality list message ==========
                    let detailText = `🎬 *ᶦᶰᵈ᭄ ᴍᴇᴢᴜᴋᴀ ᴍᴅ 亗*\n\n`;
                    detailText += `📌 *${movieData.title}*\n`;
                    if (movieData.year) detailText += `📅 *Year:* ${movieData.year}\n`;
                    if (movieData.language) detailText += `🗣️ *Language:* ${movieData.language}\n`;
                    if (movieData.genres?.length) detailText += `🎭 *Genre:* ${movieData.genres.join(', ')}\n`;
                    if (movieData.director) detailText += `🎬 *Director:* ${movieData.director}\n`;

                    detailText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                    if (movieData.description) {
                        const desc = movieData.description;
                        detailText += `📖 *About:*\n${desc.substring(0, 350)}${desc.length > 350 ? '...' : ''}\n\n`;
                    }
                    detailText += `━━━━━━━━━━━━━━━━━━━━\n`;
                    detailText += `📥 *Select a quality to download:*\n\n`;

                    downloads.forEach((d, i) => {
                        detailText += `*${i + 1} -* 📀 ${d.quality || 'Unknown'}${d.size ? ` | 💾 ${d.size}` : ''}\n`;
                    });
                    detailText += `\n_Reply with the number to download_ ⬆️`;

                    const detailMsg = await conn.sendMessage(from, {
                        image: { url: movieData.poster || listBanner },
                        caption: detailText,
                        contextInfo: {
                            forwardingScore: 1000,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: NEWSLETTER
                        }
                    }, { quoted: replyMsg });

                    const detailMsgID = detailMsg.key.id;

                    global.movieDownloads = global.movieDownloads || {};
                    global.movieDownloads[detailMsgID] = {
                        title: movieData.title,
                        downloads,
                        from,
                        expiry: Date.now() + 5 * 60 * 1000
                    };

                    // ========== Quality / download listener ==========
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

                                const session2 = global.movieDownloads[detailMsgID];
                                if (!session2) {
                                    await conn.sendMessage(from, {
                                        text: `❌ Session expired! Use *${prefix}movie* again.`
                                    }, { quoted: dlMsg });
                                    conn.ev.off('messages.upsert', downloadListener);
                                    return;
                                }

                                const dlNum = parseInt(dlChoice);
                                if (isNaN(dlNum) || dlNum < 1 || dlNum > session2.downloads.length) {
                                    await conn.sendMessage(from, {
                                        text: `❌ Invalid! Reply with a number between 1 and ${session2.downloads.length}.`
                                    }, { quoted: dlMsg });
                                    continue;
                                }

                                conn.ev.off('messages.upsert', downloadListener);
                                delete global.movieDownloads[detailMsgID];

                                const chosen = session2.downloads[dlNum - 1];
                                const targetJid = from;
                                const quotedMsg = dlMsg;

                                await conn.sendMessage(from, {
                                    text: `⬇️ *Sending file...*\n\n🎬 *${session2.title}*\n📀 *Quality:* ${chosen.quality || 'Unknown'}${chosen.size ? `\n💾 *Size:* ${chosen.size}` : ''}\n\nPlease wait, mb ekak nm time gannawa...`
                                }, { quoted: dlMsg });

                                const safeFileName = `${session2.title.replace(/[\\/:*?"<>|]/g, '')} - ${chosen.quality || ''}.mp4`;
                                const directDownloadUrl = chosen.mp4;
                                const doneCaption =
                                    `🎬 *${session2.title}*\n` +
                                    `📀 *Quality:* ${chosen.quality || 'Unknown'}\n` +
                                    `${chosen.size ? `💾 *Size:* ${chosen.size}\n` : ''}` +
                                    `\n_Powered by ᴍᴇᴢᴜᴋᴀ ᴍᴅ_ 🖤`;

                                try {
                                    await conn.sendMessage(targetJid || from, {
                                        document: { url: directDownloadUrl },
                                        mimetype: 'video/mp4',
                                        fileName: safeFileName,
                                        caption: doneCaption,
                                        contextInfo: {
                                            forwardingScore: 1000,
                                            isForwarded: true,
                                            forwardedNewsletterMessageInfo: NEWSLETTER
                                        }
                                    }, { quoted: quotedMsg });

                                    await conn.sendMessage(from, {
                                        react: { text: '✅', key: mek.key }
                                    });
                                } catch (sendErr) {
                                    console.error('Movie send error:', sendErr);
                                    await conn.sendMessage(from, {
                                        text: `❌ File send karaddi error ekak une!\n\n${sendErr.message}\n\nVenas quality ekak try karanna.`
                                    }, { quoted: dlMsg });
                                }
                            }
                        } catch (err) {
                            console.error('Movie download error:', err);
                            await conn.sendMessage(from, { text: `❌ Error: ${err.message}` });
                        }
                    };

                    conn.ev.on('messages.upsert', downloadListener);
                    setTimeout(() => {
                        conn.ev.off('messages.upsert', downloadListener);
                        delete global.movieDownloads?.[detailMsgID];
                    }, 5 * 60 * 1000);
                }
            } catch (err) {
                console.error('Movie selection error:', err);
                await conn.sendMessage(from, { text: `❌ Error: ${err.message}` });
            }
        };

        conn.ev.on('messages.upsert', replyListener);
        setTimeout(() => {
            conn.ev.off('messages.upsert', replyListener);
            delete global.movieSessions?.[messageID];
        }, 5 * 60 * 1000);

    } catch (e) {
        console.error('Movie command error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ *Error!*\n\nPlease try again later.`);
    }

    }
};

