// ============================================================
// COMMAND: tagonline
// MEZUKA MD V5 - command/tagonline.js
// Note: WhatsApp does not expose real online status via Baileys API.
// This command tags members who have recently been seen (last seen available).
// ============================================================
module.exports = {
    name: "tagonline",
    aliases: ["online", "tagactive"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, q, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🟢 *Tag Online* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ා 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        const senderMember = groupParticipants.find(p => numOnly(p.id) === numOnly(sender));
        const isSenderAdmin = senderMember?.admin === 'admin' || senderMember?.admin === 'superadmin';
        if (!isSenderAdmin && !isOwner) return reply(`꒰ᵎ 🟢 *Tag Online* ᵎ꒱\n\n❌ Only admins can use this command!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        // Check presence for each member
        const onlineMembers = [];
        const checkLimit = Math.min(groupParticipants.length, 50); // max 50 to avoid rate limit

        for (let i = 0; i < checkLimit; i++) {
            const participant = groupParticipants[i];
            try {
                await conn.presenceSubscribe(participant.id);
                await new Promise(r => setTimeout(r, 300));
                const status = await conn.fetchStatus(participant.id).catch(() => null);
                // Check lastSeen within last 10 minutes
                if (status?.lastSeen) {
                    const diff = (Date.now() / 1000) - status.lastSeen;
                    if (diff < 600) onlineMembers.push(participant);
                }
            } catch {}
        }

        if (onlineMembers.length === 0) {
            return reply(`꒰ᵎ 🟢 *Tag Online* ᵎ꒱\n\n😴 No recently active members found!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const mentions = onlineMembers.map(p => p.id);
        const mentionText = onlineMembers.map(p => `🟢 @${numOnly(p.id)}`).join('\n');
        const caption = q ? q : '🟢 Hey active members!';

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🟢 *Tag Online* ᵎ꒱\n\n${caption}\n\n🟢 *Active members:* ${onlineMembers.length}\n\n${mentionText}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: mentions
        }, { quoted: adhiqmini });

        await m.react('🟢');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('TagOnline Error:', e);
    }
    }
};
