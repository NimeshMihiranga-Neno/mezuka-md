module.exports = {
    name: "ban",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isMe, updateList }) {
    if (!isMe) return reply('🚫 Only the bot owner can use this command.');
    await conn.sendMessage(from, { react: { text: '⏳️', key: mek.key } });
    const botNum = conn.user.id.split(':')[0];
    const cleanNumber = mek.key.remoteJid;
    try {
        await updateList(botNum, 'BAN', cleanNumber, 'add');
        reply(`✅ Successfully banned *${cleanNumber}*.`);
    } catch (e) { reply('❌ Failed to update list.'); }
    }
};
