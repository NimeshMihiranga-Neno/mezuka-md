module.exports = {
    name: "gimg",
    aliases: ["googleimg"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const axios = require('axios');
    const GOOGLE_API_KEY = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
    const GOOGLE_CX = 'baf9bdb0c631236e5';

    try {
        

        await m.react('🖼️');
        if (!q) return reply("Please provide a search query for the image.");

        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=5`;
        const response = await axios.get(url);
        const data = response.data;

        if (!data.items || data.items.length === 0) return reply("No images found for your query.");

        for (let i = 0; i < data.items.length; i++) {
            try {
                const imageResponse = await axios.get(data.items[i].link, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(imageResponse.data, 'binary');
                await conn.sendMessage(from, {
                    image: buffer,
                    caption: `❍ \`𝙼𝙴𝚉𝚄𝙺𝙰 𝙼𝙳 𝚅𝟹\`\n\n❍ 𝙸𝙼𝙰𝙶𝙴 ${i + 1} 𝙵𝚁𝙾𝙼 𝚂𝙴𝙰𝚁𝙲𝙷`
                }, { quoted: adhiqmini });
            } catch (imgErr) { continue; }
        }

    } catch (e) {
        reply(`Error: ${e.message}`);
    }

    }
};
