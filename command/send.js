// ============================================================
// COMMAND: send
// MEZUKA MD V5 - command/send.js
// ============================================================

module.exports = {
    name: "send",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    const fs = require('fs');
    const path = require('path');
    const { downloadMediaMessage } = require('@whiskeysockets/baileys');

    try {
        

        await m.react('⤵️');

        const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ʀᴇᴘʟʏ ᴛᴏ ᴀ sᴛᴀᴛᴜs* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Please reply to a status message!`);

        let messageType = null;
        let mediaMessage = null;
        let caption = '';

        if (quotedMsg.imageMessage) {
            messageType = 'image'; mediaMessage = quotedMsg.imageMessage; caption = quotedMsg.imageMessage.caption || '';
        } else if (quotedMsg.videoMessage) {
            messageType = 'video'; mediaMessage = quotedMsg.videoMessage; caption = quotedMsg.videoMessage.caption || '';
        } else if (quotedMsg.audioMessage) {
            messageType = 'audio'; mediaMessage = quotedMsg.audioMessage;
        } else if (quotedMsg.stickerMessage) {
            messageType = 'sticker'; mediaMessage = quotedMsg.stickerMessage;
        }

        if (!mediaMessage) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ This message type is not supported!`);

        await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ sᴛᴀᴛᴜs* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n⏬ Please wait...` });
        await m.react('⤴️');

        let buffer;
        try {
            buffer = await downloadMediaMessage(
                { message: quotedMsg },
                'buffer',
                {},
                { logger: console, reuploadRequest: conn.updateMediaMessage }
            );
        } catch (downloadError) {
            return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Status might have expired or been deleted!`);
        }

        if (!buffer || buffer.length === 0) return reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇᴍᴘᴛʏ ꜰɪʟᴇ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ Downloaded file is empty!`);

        const fileSizeKB = Math.round(buffer.length / 1024);
        const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
        const sizeText = fileSizeKB > 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

        const statusCaption = `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *sᴛᴀᴛᴜs sᴀᴠᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n📝 *ᴄᴀᴘᴛɪᴏɴ* ➤ ${caption || 'No caption'}\n📏 *sɪᴢᴇ* ➤ ${sizeText}\n⏰ *ᴛɪᴍᴇ* ➤ ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}\n\n${GQCAP}`;

        switch (messageType) {
            case 'image':
                await conn.sendMessage(from, { image: buffer, caption: statusCaption, mimetype: 'image/jpeg' }, { quoted: adhiqmini });
                break;
            case 'video':
                await conn.sendMessage(from, { video: buffer, caption: statusCaption, mimetype: 'video/mp4', gifPlayback: mediaMessage.gifPlayback || false }, { quoted: adhiqmini });
                break;
            case 'audio':
                await conn.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg', ptt: mediaMessage.ptt || false }, { quoted: adhiqmini });
                await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴀᴜᴅɪᴏ sᴀᴠᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n📏 *sɪᴢᴇ* ➤ ${sizeText}\n\n${GQCAP}` }, { quoted: adhiqmini });
                break;
            case 'sticker':
                await conn.sendMessage(from, { sticker: buffer }, { quoted: adhiqmini });
                await conn.sendMessage(from, { text: `🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *sᴛɪᴄᴋᴇʀ sᴀᴠᴇᴅ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n📏 *sɪᴢᴇ* ➤ ${sizeText}\n\n${GQCAP}` }, { quoted: adhiqmini });
                break;
        }

        await m.react('✅');

    } catch (e) {
        reply(`🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ᴇʀʀᴏʀ* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉\n\n❌ ${e.message}`);
    }

    }
};
