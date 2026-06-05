// ============================================================
// COMMAND: tagadmin
// MEZUKA MD V5 - command/tagadmin.js
// ============================================================
module.exports = {
    name: "tagadmin",
    aliases: ["admins", "calladmin"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, q, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 👑 *Tag Admin* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        const admins = groupParticipants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

        if (admins.length === 0) return reply(`꒰ᵎ 👑 *Tag Admin* ᵎ꒱\n\n❌ No admins found in this group!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const mentions = admins.map(p => p.id);
        const mentionText = admins.map(p => `👑 @${numOnly(p.id)}`).join('\n');
        const caption = q ? q : '📣 Calling all admins!';

        await conn.sendMessage(from, {
            text: `꒰ᵎ 👑 *Tag Admin* ᵎ꒱\n\n${caption}\n\n👑 *Admins:* ${admins.length}\n\n${mentionText}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: mentions
        }, { quoted: adhiqmini });

        await m.react('👑');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('TagAdmin Error:', e);
    }
    }
};
