module.exports = {
    name: "trt",
    aliases: ["translate"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const axios = require('axios');
    try {
        
        const argsArr = q.split(' ');
        if (argsArr.length < 2) return reply("❗ Please provide a language code and text.\nEg: .trt fr Hello");
        const targetLang = argsArr[0];
        const textToTranslate = argsArr.slice(1).join(' ');
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;
        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;
        return reply(`🌍 *MEZUKA MD V5* 🌍\n\n🔤 *ᴏʀɪɢɪɴᴀʟ*: ${textToTranslate}\n\n🔠 *ᴛʀᴀɴꜱʟᴀᴛᴇᴅ*: ${translation}\n\n🌐 *ʟᴀɴɢᴜᴀɢᴇ*: ${targetLang.toUpperCase()}\n\nMEZUKA MD V5`);
    } catch (e) { reply("⚠️ An error occurred while translating. Please try again later."); }
    }
};
