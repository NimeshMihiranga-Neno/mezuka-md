// ============================================================
// COMMAND: cid
// MEZUKA MD V5 - command/cid.js
// ============================================================

module.exports = {
    name: "cid",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        await m.react('⤵️');

        if (!q) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ ʟɪɴᴋ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\nExample: .cid https://whatsapp.com/channel/123456789`);

        const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɪɴᴠᴀʟɪᴅ ʟɪɴᴋ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Invalid channel link format!`);

        const inviteId = match[1];

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ꜰᴇᴛᴄʜɪɴɢ ᴄʜᴀɴɴᴇʟ ɪɴꜰᴏ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🔎 ${inviteId}` });
        await m.react('⤴️');

        const metadata = await conn.newsletterMetadata("invite", inviteId);

        if (!metadata || !metadata.id) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ɴᴏᴛ ꜰᴏᴜɴᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Channel not found or inaccessible!`);

        const caption = `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴄʜᴀɴɴᴇʟ ɪɴꜰᴏ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n🆔 *ɪᴅ* ➤ ${metadata.id}\n📌 *ɴᴀᴍᴇ* ➤ ${metadata.name}\n👥 *ꜰᴏʟʟᴏᴡᴇʀs* ➤ ${metadata.subscribers?.toLocaleString() || 'N/A'}\n📅 *ᴄʀᴇᴀᴛᴇᴅ* ➤ ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("si-LK") : 'Unknown'}\n\n${GQCAP}`;

        if (metadata.preview) {
            await conn.sendMessage(from, {
                image: { url: `https://pps.whatsapp.net${metadata.preview}` },
                caption
            }, { quoted: adhiqmini });
        } else {
            await conn.sendMessage(from, { text: caption }, { quoted: adhiqmini });
        }

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
