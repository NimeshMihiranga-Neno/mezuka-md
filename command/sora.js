// ============================================================
// COMMAND: sora
// MEZUKA MD V5 - command/sora.js
// ============================================================

module.exports = {
    name: "sora",
    aliases: ["soraai", "txt2video"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const react = async (emoji) => {
        await conn.sendMessage(from, {
            react: { text: emoji, key: mek.key }
        });
    };

    try {
        const axios = require('axios');

        const prompt = q;
        if (!prompt) {
            await react('❓');
            return reply(`꒰ᵎ 🎬 *Sora AI Video* ᵎ꒱

⚠️ Please provide a video prompt!

📌 *Usage:* ${prefix}sora <prompt>
📌 *Example:* ${prefix}sora cat dancing in rain

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        await react('🎬');

        const thumbnail = require('../image').SORA_CMD;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `꒰ᵎ 🎬 *Sora AI Video* ᵎ꒱

✨ *Prompt* ➜ ${prompt}

⚡ Generating your AI video...
🕐 This may take up to 60 seconds.

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

        const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(prompt)}`;
        const { data } = await axios.get(apiUrl, { timeout: 60000 });

        const videoUrl = data?.videoUrl || data?.result;

        if (!videoUrl) {
            await react('❌');
            return reply(`꒰ᵎ 🎬 *Sora AI Video* ᵎ꒱

❌ Failed to generate video!
💡 Try a different or more detailed prompt.

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `꒰ᵎ 🎬 *Sora AI Video* ᵎ꒱

✅ *Generation Complete!*

🎥 *Prompt* ➜ ${prompt}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: mek });

        await react('✅');

    } catch (e) {
        await react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱

⚠️ ${e.message}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('Sora AI Error:', e);
    }

    }
};
