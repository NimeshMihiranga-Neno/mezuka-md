// ============================================================
// COMMAND: url
// MEZUKA MD V5 - command/url.js
// ============================================================

module.exports = {
    name: "url",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        const axios = require("axios");
        const FormData = require("form-data");
        const fs = require("fs");
        const path = require("path");

        async function uploadToCatbox(filePath) {
            try {
                const form = new FormData();
                form.append("reqtype", "fileupload");
                form.append("fileToUpload", fs.createReadStream(filePath));

                const response = await axios.post("https://catbox.moe/user/api.php", form, {
                    headers: form.getHeaders(),
                });

                if (!response.data.startsWith("https://")) {
                    return "Upload Failed! Response: " + response.data;
                }

                return response.data;
            } catch (error) {
                return "Error uploading file: " + error.message;
            }
        }

        let mediaType = '';
        if (quoted.type.includes("image")) {
            mediaType = "jpg";
        } else if (quoted.type.includes("video")) {
            mediaType = "mp4";
        } else if (quoted.type.includes("sticker")) {
            mediaType = "webp";
        } else if (quoted.type.includes("audio")) {
            mediaType = "mp3";
        }

        const tempFileName = `Mezuka_MD_V4(NENOMODS)_${Math.random().toString(36).substring(2, 10)}.${mediaType}`;
        const tempFilePath = path.join(__dirname, 'temp', tempFileName);

        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) {
            return reply("⚠️ Failed to download the media. Please try again.");
        }

        fs.writeFileSync(tempFilePath, mediaBuffer);

        if (!fs.existsSync(tempFilePath)) {
            return reply("⚠️ Media file could not be found after download.");
        }

        const uploadURL = await uploadToCatbox(tempFilePath);
        fs.unlinkSync(tempFilePath);

        reply(`✅ *Uploaded Successfully!*\n🔗 *Link:* ${uploadURL}\n\n${GQCAP}`);

    } catch (e) {
        reply(`⚠️ Error processing media: ${e.message}`);
    }

    }
};
