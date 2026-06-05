// ============================================================
// COMMAND: jid
// MEZUKA MD V5 - command/jid.js
// ============================================================

module.exports = {
    name: "jid",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        if (!isOwner) return await reply(' *Is Owner Only Commands*');

        const chatJid = from;
        reply(`${chatJid}`);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('Error while retrieving the JID!');
    }

    }
};
