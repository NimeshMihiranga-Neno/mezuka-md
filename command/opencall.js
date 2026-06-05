module.exports = {
    name: "opencall",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isMe, updateList }) {
    if (!isMe) return reply('🚫 Only the bot owner can use this command.');
    await conn.sendMessage(from, { react: { text: '⏳️', key: mek.key } });
    const botNum = conn.user.id.split(':')[0];
    const cleanNumber = mek.key.remoteJid;
    if (!cleanNumber || !cleanNumber.endsWith('@s.whatsapp.net')) return reply('⚠️ Invalid WhatsApp number.');
    try {
        await updateList(botNum, 'CALL_REJECT_NUMBERS', cleanNumber, 'remove');
        await updateList(botNum, 'CALL_NO_REJECT_NUMBERS', cleanNumber, 'add');
        reply(`✅ Successfully added *${cleanNumber}* to the calls enable list.`);
    } catch (e) { reply('❌ Failed to update list.'); }
    }
};
