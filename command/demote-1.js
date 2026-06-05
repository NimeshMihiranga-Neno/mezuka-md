// ============================================================
// COMMAND: demote
// MEZUKA MD V5 - command/demote.js
// ============================================================
module.exports = {
    name: "demote",
    aliases: ["removeadmin", "deadmin"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, prefix, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        let botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(botNumber));
        if (!botMember && conn.user?.lid) {
            botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(conn.user.lid));
        }
        const isBotAdmin = botMember?.admin === 'admin' || botMember?.admin === 'superadmin';
        if (!isBotAdmin) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n⚠️ Bot is not an admin!\nPlease make the bot a group admin first.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const senderMember = groupParticipants.find(p => numOnly(p.id) === numOnly(sender));
        const isSenderAdmin = senderMember?.admin === 'admin' || senderMember?.admin === 'superadmin';
        if (!isSenderAdmin && !isOwner) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n❌ Only admins can use this command!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const mentionedJid = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = mek.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentionedJid[0] || quotedParticipant;

        if (!target) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n⚠️ Please mention or reply to a user!\n\n📌 *Usage:* ${prefix}demote @user\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const targetMember = groupParticipants.find(p => numOnly(p.id) === numOnly(target));
        if (!targetMember) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n❌ This user is not in the group!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const isTargetAdmin = targetMember?.admin === 'admin' || targetMember?.admin === 'superadmin';
        if (!isTargetAdmin) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n⚠️ This user is not an admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        if (targetMember?.admin === 'superadmin' && !isOwner) return reply(`꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n❌ Cannot demote the group creator!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const targetJid = targetMember.id;

        await conn.groupParticipantsUpdate(from, [targetJid], "demote");

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🔻 *Demote* ᵎ꒱\n\n🔻 @${numOnly(target)} has been demoted from admin!\n\n👤 *Demoted by:* @${numOnly(sender)}\n🏠 *Group:* ${groupMetadata.subject}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [targetJid, sender]
        }, { quoted: adhiqmini });

        await m.react('🔻');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('Demote Error:', e);
    }
    }
};
