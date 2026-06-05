module.exports = {
    name: "revokelink",
    aliases: ["resetlink"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        if (!isGroup) return reply('❌ Group එකේ විතරයි!');
        const groupMeta = await conn.groupMetadata(from);
        const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        if (!groupMeta.participants.find(p => p.id === botId)?.admin) return reply('❌ Bot එකට admin rights නෑ!');
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        if (!groupAdmins.includes(sender) && !isOwner) return reply('❌ ඔබ group admin කෙනෙක් නෙමෙයි!');
        await conn.sendMessage(from, { react: { text: '🔄', key: mek.key } });
        await conn.groupRevokeInvite(from);
        await reply('✅ Group invite link revoked!');
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
