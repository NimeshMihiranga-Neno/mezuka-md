module.exports = {
    name: "toimg",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fs = require('fs');
    const fileType = require('file-type');
    const getRandom = require('./lib/getRandom');
    try {
        
        await conn.sendMessage(from, { react: { text: '🖼️', key: mek.key } });
        const isStickerMessage = quoted ? quoted.type === "stickerMessage" : false;
        if (!isStickerMessage) return reply("Please reply to a sticker to convert it into an image.");
        const randomFileName = getRandom('');
        const downloadedFile = await quoted.download(randomFileName);
        const fileInfo = await fileType.fromBuffer(downloadedFile);
        await fs.promises.writeFile('./' + fileInfo.ext, downloadedFile);
        await conn.sendMessage(from, { image: fs.readFileSync('./' + fileInfo.ext), caption: `> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹 | 𝙱𝚕𝚊𝚌𝚔 𝙲𝚊𝚝 𝙾𝚏𝚌 👩‍💻` }, { quoted: adhiqmini });
        fs.unlinkSync('./' + fileInfo.ext);
    } catch (e) { reply("*Error !!*"); }
    }
};
