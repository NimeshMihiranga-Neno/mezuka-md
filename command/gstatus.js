module.exports = {
    name: "gstatus",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, generateWAMessageContent, generateWAMessageFromContent }) {
    try {
        
        if (!isGroup) return reply('❌ Group එකේ විතරයි!');
        const groupMeta = await conn.groupMetadata(from);
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        if (!groupAdmins.includes(sender) && !isOwner) return reply('❌ ඔබ group admin කෙනෙක් නෙමෙයි!');
        if (!q) return reply('❌ Status text දෙන්න!\nExample: .gstatus Hello everyone! 🌟');
        await conn.sendMessage(from, { react: { text: '🪻', key: mek.key } });
        const crypto = require('crypto');
        const messageSecret = crypto.randomBytes(32);
        const inside = await generateWAMessageContent({ text: q }, { upload: conn.waUploadToServer });
        const msg = generateWAMessageFromContent(from, { messageContextInfo: { messageSecret }, groupStatusMessageV2: { message: { ...inside, messageContextInfo: { messageSecret } } } }, {});
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        reply('✅ *Group Status Sent Successfully!*');
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
