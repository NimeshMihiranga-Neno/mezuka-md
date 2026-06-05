module.exports = {
    name: "members",
    aliases: ["listmembers"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        if (!isGroup) return reply('❌ Group එකේ විතරයි!');
        await conn.sendMessage(from, { react: { text: '👥', key: mek.key } });
        const groupMeta = await conn.groupMetadata(from);
        let text = `👥 *MEMBER LIST* (${groupMeta.participants.length})\n\n`;
        groupMeta.participants.forEach((p, i) => { const badge = p.admin === 'superadmin' ? '👑' : p.admin ? '⭐' : '👤'; text += `${i + 1}. ${badge} @${p.id.split('@')[0]}\n`; });
        text += `\n> ©ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3 ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ`;
        await conn.sendMessage(from, { text, mentions: groupMeta.participants.map(p => p.id) }, { quoted: adhiqmini });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
