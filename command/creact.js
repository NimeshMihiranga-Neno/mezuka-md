// ============================================================
// COMMAND: creact
// MEZUKA MD V5 - command/creact.js
// ============================================================

module.exports = {
    name: "creact",
    aliases: ["channelreact"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        if (!q || !q.includes(',')) {
            return reply("❌ Please provide a valid link and reaction, separated by a comma.\nExample: .creact https://whatsapp.com/channel/12345/67890, ❤️");
        }

        const [link, reactRaw] = q.split(',');
        const react = reactRaw.trim();
        const parts = link.trim().split('/');

        if (parts.length < 6) {
            return reply("❌ Invalid link format. Please provide a proper channel message link.");
        }

        const channelId = parts[4];
        const messageId = parts[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, react);

        reply(`✅ Successfully reacted with "${react}" to the message.`);

    } catch (e) {
        reply("❌ Error: " + e.toString());
    }

    }
};
