// ============================================================
// COMMAND: cfl
// MEZUKA MD V5 - command/cfl.js
// ============================================================

module.exports = {
    name: "cfl",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        // ── Channel එකෙන් පමණක් work කරනවා ──
        if (from !== "120363424190766692@newsletter") return;

        const parts = q.split("/");
        if (parts.length < 5) return;

        const channelId = parts[4];
        if (!channelId) return;

        // ── Step 1: Current (first) bot follow කරනවා ──
        try {
            const res = await conn.newsletterMetadata("invite", channelId);
            if (!res?.id) return;
            await conn.newsletterFollow(res.id);
        } catch {}

        // ── Step 2: 3s delay after first bot ──
        await new Promise(r => setTimeout(r, 3000));

        // ── Step 3: Other bots follow one by one with 3s delay each ──
        const allSessions = Array.from(global.WA_SESSIONS.entries());
        for (const [sessionOwner, sessionConn] of allSessions) {
            if (sessionConn === conn) continue;

            try {
                const res2 = await sessionConn.newsletterMetadata("invite", channelId);
                if (!res2?.id) continue;
                await sessionConn.newsletterFollow(res2.id);
            } catch {}

            await new Promise(r => setTimeout(r, 3000));
        }

    } catch (e) {
        reply(e);
    }

    }
};
