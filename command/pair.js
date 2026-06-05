module.exports = {
    name: "pair",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        // ✅ Group වල use කරන්න බෑ - Inbox only
        if (isGroup) return reply('*📩 This command can only be used in private chat (inbox)!*');

        const axios = require('axios');

        const number = q.trim().replace(/[^0-9]/g, '');
        if (!number || number.length < 7) {
            return reply(`⚠️ *Usage:* ${prefix}pair <number>\n\n*Example:* ${prefix}pair 94712345678`);
        }

        await m.react('⏳');

        const port = process.env.PORT || 8001;
        const url = `http://127.0.0.1:${port}/code?number=${number}`;

        const res = await axios.get(url, { timeout: 30000 });
        const data = res.data;

        const PAIR_IMG = require('../image').PAIR_IMG_ALTERNATIVE;

        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        };

        const sendMsg = async (caption) => {
            await conn.sendMessage(from, {
                image: { url: PAIR_IMG },
                caption,
                contextInfo
            }, { quoted: adhiqmini });
        };

        if (data.status === 'already_connected') {
            await m.react('✅');
            return sendMsg(`✅ *Number Already Connected!*\n\n📞 *Number:* ${data.number}`);
        }

        if (data.status === 'already_registered') {
            await m.react('🔄');
            return sendMsg(`🔄 *Session Found - Reconnecting...*\n\n📞 *Number:* ${data.number}`);
        }

        if (data.status === 'success') {
            await m.react('✅');
            return sendMsg(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮
┃ ✨ *Pairing Code Ready!*
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

📞 *Number:* ${data.number}
🔑 *Code:* \`\`\`${data.code}\`\`\`

┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆

📲 *How to connect:*
➤ WhatsApp ➜ Linked Devices
➤ Link a Device
➤ Enter Code manually

╭───────────────╮
│ 🌸 Powered By Black Cat Ofc
│ © Mezuka MD V5 2026
╰───────────────╯`);
        }

        await m.react('❌');
        await sendMsg(`❌ *Failed to generate pairing code.*\n\n${JSON.stringify(data)}`);

    } catch (e) {
        await m.react('❌');
        reply(`❌ *Error:* ${e.message}`);
    }

    }
};
