// ============================================================
// COMMAND: unmute
// MEZUKA MD V5 - command/unmute.js
// ============================================================
module.exports = {
    name: "unmute",
    aliases: ["unmutegc", "opengroup"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        let botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(botNumber));
        if (!botMember && conn.user?.lid) {
            botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(conn.user.lid));
        }
        const isBotAdmin = botMember?.admin === 'admin' || botMember?.admin === 'superadmin';
        if (!isBotAdmin) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n⚠️ Bot is not an admin!\nPlease make the bot a group admin first.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const senderMember = groupParticipants.find(p => numOnly(p.id) === numOnly(sender));
        const isSenderAdmin = senderMember?.admin === 'admin' || senderMember?.admin === 'superadmin';
        if (!isSenderAdmin && !isOwner) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n❌ Only admins can use this command!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await conn.groupSettingUpdate(from, 'not_announcement');

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n🔊 Group has been *unmuted!*\nEveryone can send messages now.\n\n🏠 *Group:* ${groupMetadata.subject}\n👤 *Unmuted by:* @${numOnly(sender)}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [sender]
        }, { quoted: adhiqmini });

        await m.react('🔊');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('Unmute Error:', e);
    }
    }
};
