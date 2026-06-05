module.exports = {
    name: "fancy",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    
    await conn.sendMessage(from, { react: { text: '🪞', key: mek.key } });
    try {
        if (!q) return reply("❌ *Please Check Again Format not support* ❌");
        const fancy_text = await fancy(q);
        await reply(fancy_text);
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`Error: ${e.message}`);
    }
    }
};
