// ============================================================
// COMMAND: rmbg
// MEZUKA MD V5 - command/rmbg.js
// ============================================================

module.exports = {
    name: "rmbg",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        const axios = require("axios");
        const fs = require("fs");
        const path = require("path");
        const Crypto = require("crypto");

        await m.react('🎀');

        if (!quoted || !quoted.type.includes("image")) {
            return reply("⚠️ කරුණාකර remove.bg සඳහා image එකක් quote කරන්න!");
        }

        const apiKey = "bUWEepJhy7c9kJXpvq12AWFL";
        const tempFileName = `RMBG_${Crypto.randomBytes(6).toString("hex")}.png`;
        const tempFilePath = path.join(__dirname, 'temp', tempFileName);

        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) return reply("⚠️ Failed to download the image!");

        fs.writeFileSync(tempFilePath, mediaBuffer);

        const response = await axios.post(
            "https://api.remove.bg/v1.0/removebg",
            { image_file_b64: mediaBuffer.toString("base64"), size: "auto" },
            { headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" }, responseType: "arraybuffer" }
        );

        fs.writeFileSync(tempFilePath, response.data);

        await conn.sendMessage(m.chat, {
            image: fs.readFileSync(tempFilePath),
            caption: `\n\n✅ *Background removed successfully!*`
        });

        fs.unlinkSync(tempFilePath);

    } catch (e) {
        reply(`⚠️ Error: ${e.message}`);
    }

    }
};
