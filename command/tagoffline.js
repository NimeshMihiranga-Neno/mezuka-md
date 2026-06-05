// ============================================================
// COMMAND: tagoffline
// MEZUKA MD V5 - command/tagoffline.js
// Tags members who have NOT been seen recently (last seen > 10 min or hidden)
// ============================================================
module.exports = {
    name: "tagoffline",
    aliases: ["offline", "taginactive"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, q, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔴 *Tag Offline* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        const senderMember = groupParticipants.find(p => numOnly(p.id) === numOnly(sender));
        const isSenderAdmin = senderMember?.admin === 'admin' || senderMember?.admin === 'superadmin';
        if (!isSenderAdmin && !isOwner) return reply(`꒰ᵎ 🔴 *Tag Offline* ᵎ꒱\n\n❌ Only admins can use this command!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        const offlineMembers = [];
        const checkLimit = Math.min(groupParticipants.length, 50);

        for (let i = 0; i < checkLimit; i++) {
            const participant = groupParticipants[i];
            try {
                const status = await conn.fetchStatus(participant.id).catch(() => null);
                if (!status?.lastSeen) {
                    offlineMembers.push(participant);
                } else {
                    const diff = (Date.now() / 1000) - status.lastSeen;
                    if (diff >= 600) offlineMembers.push(participant);
                }
            } catch {
                offlineMembers.push(participant);
            }
        }

        if (offlineMembers.length === 0) {
            return reply(`꒰ᵎ 🔴 *Tag Offline* ᵎ꒱\n\n✅ Everyone seems to be active!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const mentions = offlineMembers.map(p => p.id);
        const mentionText = offlineMembers.map(p => `🔴 @${numOnly(p.id)}`).join('\n');
        const caption = q ? q : '🔴 Hey offline members, you missed something!';

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🔴 *Tag Offline* ᵎ꒱\n\n${caption}\n\n🔴 *Offline members:* ${offlineMembers.length}\n\n${mentionText}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: mentions
        }, { quoted: adhiqmini });

        await m.react('🔴');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('TagOffline Error:', e);
    }
    }
};
