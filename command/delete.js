module.exports = {
    name: "delete",
    aliases: ["del"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        if (!m.quoted) return reply('❌ Delete කරන්න message එකකට reply කරන්න!');
        if (isGroup) {
            const groupMeta = await conn.groupMetadata(from);
            const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
            if (!groupAdmins.includes(sender) && !isOwner) return reply('❌ ඔබ group admin කෙනෙක් නෙමෙයි!');
        }
        await conn.sendMessage(from, { react: { text: '🗑️', key: mek.key } });
        await conn.sendMessage(from, { delete: m.quoted.key });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
