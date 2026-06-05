module.exports = {
    name: "unban",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isMe, updateList }) {
    if (!isMe) return reply('🚫 Only the bot owner can use this command.');
    await conn.sendMessage(from, { react: { text: '⏳️', key: mek.key } });
    const botNum = conn.user.id.split(':')[0];
    const cleanNumber = mek.key.remoteJid;
    try {
        await updateList(botNum, 'BAN', cleanNumber, 'remove');
        reply(`✅ Successfully unbanned *${cleanNumber}*.`);
    } catch (e) { reply('❌ Failed to update list.'); }
    }
};
