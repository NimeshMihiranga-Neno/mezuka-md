// ============================================================
// COMMAND: kick
// MEZUKA MD V5 - command/kick.js
// ============================================================

module.exports = {
    name: "kick",
    aliases: ["remove", "kickout"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, prefix, adhiqmini }) {

    try {

        // Group check
        if (!isGroup) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ This command can only be used in groups!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;

        const numOnly = (jid) => (jid || '').split('@')[0].split(':')[0];

        // Find member — supports both @s.whatsapp.net and @lid formats
        const findMember = (jidToFind) => {
            const num = numOnly(jidToFind);
            let member = groupParticipants.find(p => numOnly(p.id) === num);
            if (!member && conn.user?.lid) {
                const lidNum = numOnly(conn.user.lid);
                if (num === numOnly(botNumber)) {
                    member = groupParticipants.find(p => numOnly(p.id) === lidNum);
                }
            }
            return member || null;
        };

        // Check if bot is admin
        let botMember = groupParticipants.find(p => numOnly(p.id) === numOnly(botNumber));
        if (!botMember && conn.user?.lid) {
            const lidNum = numOnly(conn.user.lid);
            botMember = groupParticipants.find(p => numOnly(p.id) === lidNum);
        }
        const isBotAdmin = botMember?.admin === 'admin' || botMember?.admin === 'superadmin';

        if (!isBotAdmin) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

⚠️ Bot is not an admin!
Please make the bot a group admin first.

📌 *How to fix:*
› Open group info
› Tap bot number
› Make group admin

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Check if sender is admin or owner
        let senderMember = groupParticipants.find(p => numOnly(p.id) === numOnly(sender));
        const isSenderAdmin = senderMember?.admin === 'admin' || senderMember?.admin === 'superadmin';

        if (!isSenderAdmin && !isOwner) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ Only admins can use this command!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Get target user (mention or reply)
        let target;

        const mentionedJid = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid
            || mek.message?.imageMessage?.contextInfo?.mentionedJid
            || [];

        const quotedParticipant = mek.message?.extendedTextMessage?.contextInfo?.participant;

        if (mentionedJid && mentionedJid.length > 0) {
            target = mentionedJid[0];
        } else if (quotedParticipant) {
            target = quotedParticipant;
        } else {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

⚠️ Please mention or reply to a user!

📌 *Usage:* ${prefix}kick @user
📌 *Or reply to their message*

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Cannot kick yourself
        if (numOnly(target) === numOnly(sender)) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ You cannot kick yourself!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Cannot kick the bot
        if (numOnly(target) === numOnly(botNumber)) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ Cannot kick the bot!
If you want to remove the bot, use *Remove from group* in group settings.

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Check if target is in group
        const targetMember = groupParticipants.find(p => numOnly(p.id) === numOnly(target));
        if (!targetMember) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ This user is not in the group!

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        // Cannot kick an admin (unless owner)
        const isTargetAdmin = targetMember?.admin === 'admin' || targetMember?.admin === 'superadmin';
        if (isTargetAdmin && !isOwner) {
            return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱

❌ Cannot kick an admin!
Only the bot owner can kick admins.

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        }

        const targetJid = targetMember.id;
        const targetTag = `@${numOnly(target)}`;

        // Send kick message
        await conn.sendMessage(from, {
            text: `꒰ᵎ 👢 *Kick* ᵎ꒱

🚫 ${targetTag} has been kicked!

👤 *Kicked by:* @${numOnly(sender)}
🏠 *Group:* ${groupMetadata.subject}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [targetJid, sender]
        }, { quoted: adhiqmini });

        // Perform the kick
        await conn.groupParticipantsUpdate(from, [targetJid], "remove");

        await m.react('✅');

    } catch (e) {
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱

⚠️ ${e.message}

　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚
*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('Kick Error:', e);
    }

    }
};

