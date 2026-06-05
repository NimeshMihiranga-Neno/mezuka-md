module.exports = {
    name: "sudo",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isMe, updateEnv }) {
    if (!isMe) return reply('🚫 Only the bot owner can use this command.');
    await conn.sendMessage(from, { react: { text: '⏳️', key: mek.key } });
    const botNum = conn.user.id.split(':')[0];
    const cleanNumber = mek.key.remoteJid;
    try {
        await updateEnv(botNum, 'SUDO', cleanNumber);
        reply(`✅ Successfully enabled bot access for *${cleanNumber}*.`);
    } catch (e) { reply('❌ Failed to update list.'); }
    }
};
