// ============================================================
// COMMAND: kickall
// MEZUKA MD V5 - command/kickall.js
// Rate limited: kicks 1 member every 1.5 seconds to avoid ban
// ============================================================
module.exports = {
    name: "kickall",
    aliases: ["removeall", "cleargroup"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, botNumber, adhiqmini }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n❌ This command can only be used in groups!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        // Owner only command — too dangerous for regular admins
        if (!isOwner) return reply(`꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n❌ Only the bot owner can use this command!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;
        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        let botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(botNumber));
        if (!botMember && conn.user?.lid) {
            botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(conn.user.lid));
        }
        const isBotAdmin = botMember?.admin === 'admin' || botMember?.admin === 'superadmin';
        if (!isBotAdmin) return reply(`꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n⚠️ Bot is not an admin!\nPlease make the bot a group admin first.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        // Get non-admin members only (skip admins and bot)
        const toKick = groupParticipants.filter(p => {
            const isAdmin = p.admin === 'admin' || p.admin === 'superadmin';
            const isBot = numOnly(p.id) === numOnly(botNumber) ||
                (conn.user?.lid && numOnly(p.id) === numOnly(conn.user.lid));
            return !isAdmin && !isBot;
        });

        if (toKick.length === 0) {
            return reply(`꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n⚠️ No members to kick! Only admins are in the group.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Warning message before kick
        await conn.sendMessage(from, {
            text: `꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n⚠️ Starting kick process...\n👥 *Members to kick:* ${toKick.length}\n⏱️ *Estimated time:* ~${Math.ceil(toKick.length * 1.5)}s\n\n🔴 All non-admin members will be removed!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
        }, { quoted: adhiqmini });

        await m.react('⏳');

        let kicked = 0;
        let failed = 0;

        // Rate limited kicking — 1 per 1.5 seconds
        for (const member of toKick) {
            try {
                await conn.groupParticipantsUpdate(from, [member.id], "remove");
                kicked++;
                await new Promise(r => setTimeout(r, 1500)); // 1.5s rate limit
            } catch (err) {
                failed++;
                console.log(`KickAll failed for ${member.id}:`, err.message);
            }
        }

        await conn.sendMessage(from, {
            text: `꒰ᵎ 💥 *Kick All* ᵎ꒱\n\n✅ Kick process complete!\n\n✅ *Kicked:* ${kicked}\n❌ *Failed:* ${failed}\n\n👤 *Done by:* @${numOnly(sender)}\n🏠 *Group:* ${groupMetadata.subject}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [sender]
        }, { quoted: adhiqmini });

        await m.react('✅');
    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('KickAll Error:', e);
    }
    }
};
