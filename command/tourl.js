// ============================================================
// COMMAND: tourl
// MEZUKA MD V5 - command/tourl.js
// ============================================================

module.exports = {
    name: "tourl",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const fs = require("fs");
    const path = require('path');
    let tempFilePath;

    try {
        

        await conn.sendMessage(from, { react: { text: '📎', key: mek.key } });

        const axios = require('axios');
        const FormData = require("form-data");

        if (!quoted || !quoted.msg || !quoted.msg.url || !quoted.type.includes("image")) {
            return reply("Please Reply Image");
        }

        const tempFileName = `Mezuka_MD_V4(NENOMODS)_${Math.random().toString(36).substring(2, 10)}.jpg`;
        tempFilePath = path.join(__dirname, 'temp', tempFileName);

        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) return reply("Failed to download the image. Please try again.");

        fs.writeFileSync(tempFilePath, mediaBuffer);
        if (!fs.existsSync(tempFilePath)) return reply("Image file could not be found after download.");

        const apiKey = "5ee1798146ca754423744e7ef0ceeeb8";
        const formData = new FormData();
        formData.append("image", fs.createReadStream(tempFilePath));

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            formData,
            { headers: formData.getHeaders() }
        );

        let imageUrl;
        if (response.data && response.data.success) {
            imageUrl = response.data.data.url;
        } else {
            return reply("Image upload failed.");
        }

        reply(`✅ Image uploaded successfully!\n🌐 URL: ${imageUrl}`);
        fs.unlinkSync(tempFilePath);

    } catch (e) {
        if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        reply("❌ An error occurred while uploading the image.");
    }

    }
};
