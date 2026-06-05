module.exports = {
    name: "xdl",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const cheerio = require('cheerio');
    try {
        
        await conn.sendMessage(from, { react: { text: '🔞', key: mek.key } });
        const videoUrl = "https://www.pussyboy.net/porn/" + q + '/';
        const response = await fetch(videoUrl);
        const html = await response.text();
        const $ = cheerio.load(html);
        const videoSource = $("body > .container-xxl .videos > div.col-md-12.videos-detail > div.col-md-12.videos-details > div.ratio.ratio-16x9 > video > source").attr("src");
        await conn.sendMessage(from, { video: { url: videoSource }, mimetype: "video/mp4", caption: `> *© 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹 | 𝙱𝚕𝚊𝚌𝚔 𝙲𝚊𝚝 𝙾𝚏𝚌` }, { quoted: adhiqmini });
    } catch (e) { reply('Error'); }
    }
};
