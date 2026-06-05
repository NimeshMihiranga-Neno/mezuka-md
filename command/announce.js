module.exports = {
    name: "announce",
    aliases: ["broadcast"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        if (!isGroup) return reply('❌ Group එකේ විතරයි!');
        if (!q) return reply('❌ Message දෙන්න!\nExample: .announce Meeting at 5PM');
        const groupMeta = await conn.groupMetadata(from);
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        if (!groupAdmins.includes(sender) && !isOwner) return reply('❌ ඔබ group admin කෙනෙක් නෙමෙයි!');
        await conn.sendMessage(from, { react: { text: '📣', key: mek.key } });
        await conn.sendMessage(from, { text: `📣 *ANNOUNCEMENT*\n\n${q}\n\n> ©ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3 ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ`, contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363424190766692@newsletter', newsletterName: `ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3`, serverMessageId: 143 } } }, { quoted: adhiqmini });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
