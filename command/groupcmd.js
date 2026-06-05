module.exports = [

{
    name: "kick",
    aliases: ["remove"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const target = m.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

        if (!target) return reply(`꒰ᵎ 👢 *Kick* ᵎ꒱\n\n⚠️ Reply to a message or mention a user!\n\n📌 *Usage:* ${prefix}kick @user\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');
        await conn.groupParticipantsUpdate(from, [target], 'remove');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ 👢 *Kick* ᵎ꒱\n\n✅ *Successfully Kicked!*\n\n👤 *User:* @${target.split('@')[0]}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [target],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('KICK Error:', e);
    }
    }
},

// ============================================================
// 2. BAN (kick + notify)
// ============================================================
{
    name: "ban",
    aliases: ["blacklist"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔨 *Ban* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 🔨 *Ban* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ 🔨 *Ban* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const target = m.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

        if (!target) return reply(`꒰ᵎ 🔨 *Ban* ᵎ꒱\n\n⚠️ Reply to a message or mention a user!\n\n📌 *Usage:* ${prefix}ban @user\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🔨 *Ban* ᵎ꒱\n\n🚫 *Banning user...*\n\n👤 @${target.split('@')[0]}\n❌ You have been banned from this group!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [target],
        }, { quoted: adhiqmini });

        await conn.groupParticipantsUpdate(from, [target], 'remove');
        await m.react('✅');

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('BAN Error:', e);
    }
    }
},

// ============================================================
// 3. PROMOTE
// ============================================================
{
    name: "promote",
    aliases: ["makeadmin"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ ⬆️ *Promote* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ ⬆️ *Promote* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ ⬆️ *Promote* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const target = m.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

        if (!target) return reply(`꒰ᵎ ⬆️ *Promote* ᵎ꒱\n\n⚠️ Reply to a message or mention a user!\n\n📌 *Usage:* ${prefix}promote @user\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');
        await conn.groupParticipantsUpdate(from, [target], 'promote');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ ⬆️ *Promote* ᵎ꒱\n\n✅ *Successfully Promoted!*\n\n👤 *User:* @${target.split('@')[0]}\n🌟 *Role:* Admin\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [target],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('PROMOTE Error:', e);
    }
    }
},

// ============================================================
// 4. DEMOTE
// ============================================================
{
    name: "demote",
    aliases: ["removeadmin"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ ⬇️ *Demote* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ ⬇️ *Demote* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ ⬇️ *Demote* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const target = m.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

        if (!target) return reply(`꒰ᵎ ⬇️ *Demote* ᵎ꒱\n\n⚠️ Reply to a message or mention a user!\n\n📌 *Usage:* ${prefix}demote @user\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');
        await conn.groupParticipantsUpdate(from, [target], 'demote');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ ⬇️ *Demote* ᵎ꒱\n\n✅ *Successfully Demoted!*\n\n👤 *User:* @${target.split('@')[0]}\n📌 *Role:* Member\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            mentions: [target],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('DEMOTE Error:', e);
    }
    }
},

// ============================================================
// 5. ADD
// ============================================================
{
    name: "add",
    aliases: ["adduser"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ ➕ *Add* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ ➕ *Add* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ ➕ *Add* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const number = args[0]?.replace(/[^0-9]/g, '');
        if (!number) return reply(`꒰ᵎ ➕ *Add* ᵎ꒱\n\n⚠️ Please provide a number!\n\n📌 *Usage:* ${prefix}add 94xxxxxxxxx\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        const target = number + '@s.whatsapp.net';

        await m.react('⏳');
        await conn.groupParticipantsUpdate(from, [target], 'add');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ ➕ *Add* ᵎ꒱\n\n✅ *Successfully Added!*\n\n👤 *Number:* +${number}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('ADD Error:', e);
    }
    }
},

// ============================================================
// 6. KICKALL
// ============================================================
{
    name: "kickall",
    aliases: ["removeall"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 💣 *Kick All* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 💣 *Kick All* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ 💣 *Kick All* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants.filter(p => 
            p.id !== botNumber + '@s.whatsapp.net' && 
            p.id !== sender &&
            p.admin === null
        );

        await conn.sendMessage(from, {
            text: `꒰ᵎ 💣 *Kick All* ᵎ꒱\n\n⚠️ *Kicking ${members.length} members...*\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
        }, { quoted: adhiqmini });

        for (const member of members) {
            await conn.groupParticipantsUpdate(from, [member.id], 'remove');
            await new Promise(r => setTimeout(r, 500));
        }

        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ 💣 *Kick All* ᵎ꒱\n\n✅ *Done! Kicked ${members.length} members!*\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('KICKALL Error:', e);
    }
    }
},

// ============================================================
// 7. TAGALL
// ============================================================
{
    name: "tagall",
    aliases: ["everyone", "all"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 📢 *Tag All* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 📢 *Tag All* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants;
        const msg = args.join(' ') || '📢 Attention everyone!';

        const mentions = members.map(p => p.id);
        const text = `꒰ᵎ 📢 *Tag All* ᵎ꒱\n\n💬 *${msg}*\n\n` + 
                     members.map((p, i) => `　${i + 1}. @${p.id.split('@')[0]}`).join('\n') +
                     `\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

        await m.react('✅');

        return await conn.sendMessage(from, {
            text: text,
            mentions: mentions,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('TAGALL Error:', e);
    }
    }
},

// ============================================================
// 8. HIDETAG
// ============================================================
{
    name: "hidetag",
    aliases: ["htag", "silentag"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 👻 *Hide Tag* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 👻 *Hide Tag* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants;
        const msg = args.join(' ') || '👻 Silent tag!';

        const mentions = members.map(p => p.id);

        await m.react('✅');

        return await conn.sendMessage(from, {
            text: msg,
            mentions: mentions,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('HIDETAG Error:', e);
    }
    }
},

// ============================================================
// 9. MUTE
// ============================================================
{
    name: "mute",
    aliases: ["closechat"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔇 *Mute* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 🔇 *Mute* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ 🔇 *Mute* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');
        await conn.groupSettingUpdate(from, 'announcement');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ 🔇 *Mute* ᵎ꒱\n\n✅ *Group has been muted!*\n🔇 Only admins can send messages now.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('MUTE Error:', e);
    }
    }
},

// ============================================================
// 10. UNMUTE
// ============================================================
{
    name: "unmute",
    aliases: ["openchat"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isAdmin) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n❌ Admins only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isBotAdmin) return reply(`꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n❌ Bot needs admin!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');
        await conn.groupSettingUpdate(from, 'not_announcement');
        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ 🔊 *Unmute* ᵎ꒱\n\n✅ *Group has been unmuted!*\n🔊 Everyone can send messages now.\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('UNMUTE Error:', e);
    }
    }
},

// ============================================================
// 11. LEFT (bot leaves group)
// ============================================================
{
    name: "left",
    aliases: ["leave", "botleave"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ 🚪 *Leave* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        if (!isOwner) return reply(`꒰ᵎ 🚪 *Leave* ᵎ꒱\n\n❌ Owner only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('👋');

        await conn.sendMessage(from, {
            text: `꒰ᵎ 🚪 *Goodbye!* ᵎ꒱\n\n👋 *Bot is leaving this group...*\n\n🌸 _Take care everyone!_\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

        await new Promise(r => setTimeout(r, 2000));
        await conn.groupLeave(from);

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('LEFT Error:', e);
    }
    }
},

// ============================================================
// 12. GROUPINFO
// ============================================================
{
    name: "groupinfo",
    aliases: ["ginfo", "gcinfo", "groupdata"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isBotAdmin, isAdmin, participants }) {
    try {
        if (!isGroup) return reply(`꒰ᵎ ℹ️ *Group Info* ᵎ꒱\n\n❌ Group only!\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);

        await m.react('⏳');

        const groupData = await conn.groupMetadata(from);
        const admins = groupData.participants.filter(p => p.admin !== null);
        const members = groupData.participants.length;
        const created = new Date(groupData.creation * 1000).toLocaleDateString('en-GB');
        const desc = groupData.desc?.toString() || 'No description';

        await m.react('✅');

        return await conn.sendMessage(from, {
            text: `꒰ᵎ ℹ️ *Group Info* ᵎ꒱\n\n📌 *Name:* ${groupData.subject}\n📝 *Description:* ${desc}\n👥 *Members:* ${members}\n👑 *Admins:* ${admins.length}\n📅 *Created:* ${created}\n🆔 *ID:* ${from.split('@')[0]}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

    } catch(e) {
        await m.react('❌');
        reply(`꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`);
        console.log('GROUPINFO Error:', e);
    }
    }
},

]; 