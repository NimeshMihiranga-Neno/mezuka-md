module.exports = {
    name: "megaup",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fs = require('fs');
    const path = require('path');
    const mega = require('megajs');
    const auth = { email: 'slvimubro3@gmail.com', password: 'Vimu9522', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246' };

    const uploadToMega = (filePath, fileName) => new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, () => {
                const fileStream = fs.createReadStream(filePath);
                const uploadStream = storage.upload({ name: fileName, allowUploadBuffering: true });
                fileStream.pipe(uploadStream);
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) return reject(err);
                        storage.close();
                        const fileId = url.split("/file/")[1].split("#")[0];
                        const fileKey = url.split("#")[1];
                        resolve({ fileId, downloadLink: `https://mega.nz/file/${fileId}#${fileKey}`, viewLink: `https://mega.nz/file/${fileId}` });
                    });
                });
            });
        } catch (err) { reject(err); }
    });

    try {
        if (!isOwner) return reply("ඔබට මෙම විධානය භාවිතා කළ නොහැක.");
        if (!quoted || !quoted.msg || !quoted.msg.url || !quoted.type.includes("document")) return reply("කරුණාකර zip ගොනුවකට reply කර විධානය භාවිතා කරන්න.");
        const tempDir = path.resolve("./temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const filePath = path.join(tempDir, `${Date.now()}.zip`);
        const fileBuffer = await quoted.download();
        if (!fileBuffer || fileBuffer.length === 0) return reply("❌ ගොනුව බාගැනීමට නොහැකි විය.");
        fs.writeFileSync(filePath, fileBuffer);
        await m.react('📤');
        const { downloadLink } = await uploadToMega(filePath, path.basename(filePath));
        const base64Encoded = Buffer.from(downloadLink, 'utf8').toString('base64');
        const hexEncoded = Buffer.from(base64Encoded, 'utf8').toString('hex');
        await conn.sendMessage(from, { text: `${hexEncoded}` });
        fs.unlinkSync(filePath);
    } catch (e) { reply("❌ Mega වෙත ගොනුව upload කිරීම අසාර්ථක විය."); }
    }
};
