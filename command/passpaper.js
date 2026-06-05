module.exports = {
    name: "passpaper",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const axios = require('axios');
    const cheerio = require('cheerio');
    try {
        
        if (!q) return reply("🔎 Please provide keywords to search past papers.");
        await m.react('📄');
        const searchUrl = `https://pastpapers.wiki/?s=${encodeURIComponent(q)}`;
        const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        const articles = [];
        const links = [];
        $('article.jeg_post').each((i, el) => {
            const title = $(el).find('h3.jeg_post_title a').text().trim();
            const link = $(el).find('h3.jeg_post_title a').attr('href');
            if (title && link && articles.length < 10) { articles.push(`*${i + 1}.* ${title}`); links.push(link); }
        });
        if (!articles.length) return reply("⚠️ No past papers found for your query.");
        const msg = `🪐 *𝙈𝙀𝙕𝙐𝙆𝘼 𝙈𝘿 𝙀𝘿𝙐 𝙃𝙐𝘽* 🪐\n\n` + articles.join("\n\n") + `\n\n📥 *𝘙𝘦𝘱𝘭𝘺 𝘛𝘰 𝘕𝘶𝘮𝘣𝘦𝘳 𝘋𝘰𝘸𝘯𝘭𝘰𝘢𝘥 𝘗𝘋𝘍*`;
        const vv = await conn.sendMessage(from, { image: { url: require('../image').IXYRRZ }, caption: msg, contextInfo: { mentionedJid: [m.sender], forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363424190766692@newsletter', newsletterName: 'ᴍᴇᴢᴜᴋᴀ ᴍᴅ ʟɪᴛᴇ', serverMessageId: 143 } } }, { quoted: adhiqmini });
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            try {
                const msg2 = msgUpdate.messages[0];
                if (!msg2?.message?.extendedTextMessage) return;
                if (msg2.message.extendedTextMessage.contextInfo?.stanzaId !== vv.key.id) return;
                const selectedIndex = parseInt(msg2.message.extendedTextMessage.text.trim()) - 1;
                if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= links.length) return conn.sendMessage(from, { text: "🚫 Invalid selection." }, { quoted: msg2 });
                await conn.sendMessage(from, { react: { text: '⏳', key: msg2.key } });
                const { data: articleData } = await axios.get(links[selectedIndex], { headers: { 'User-Agent': 'Mozilla/5.0' } });
                const $$ = cheerio.load(articleData);
                const downloadLink = $$('.wpfd-button-download').attr('href');
                if (!downloadLink) return conn.sendMessage(from, { text: "⚠️ Download link not found." }, { quoted: msg2 });
                const cleanTitle = articles[selectedIndex].replace(/^\*\d+\.\*\s*/, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
                await conn.sendMessage(from, { react: { text: '📥', key: msg2.key } });
                await conn.sendMessage(from, { document: { url: downloadLink }, mimetype: "application/pdf", fileName: `${cleanTitle}.pdf`, caption: `📄 *Past Paper Downloaded*\n🔹 *Title:* ${cleanTitle.replace(/_/g, ' ')}\n\n📚 Enjoy your studies with *Mezuka MD V5*! 🌻` }, { quoted: msg2 });
            } catch (_) {}
        });
    } catch (e) { reply("⚠️ An error occurred while searching for past papers."); }
    }
};
