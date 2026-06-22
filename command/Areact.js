// ============================================================
// COMMAND: reactsetup
// MEZUKA MD - command/reactsetup.js
// Standalone, on-demand newsletter auto-react listener.
// Built using the same conn.ev.on('messages.upsert', ...) pattern
// as command/movie.js, since that pattern is confirmed working
// on the newest Baileys version. This avoids depending on the
// fragile connection-open flow where one failure could silently
// skip handler registration.
// ============================================================

// Extract a usable "server id" from a newsletter message no matter
// which field name the installed Baileys version uses for it.
function extractNewsletterServerId(msg) {
    const candidates = [
        msg?.key?.server_id,
        msg?.newsletterServerId,
        msg?.key?.serverId,
        Array.isArray(msg?.messageStubParameters) ? msg.messageStubParameters[0] : undefined,
        msg?.key?.id
    ];
    return candidates.find(v => v !== undefined && v !== null && v !== '');
}

const defaultEmojis = ['🧁','🍓','🍡','🍩','🍪','🥐','🫧','🪻','🪷','🌸','🌷','🌼','🐰','🐹','🐣','🦋','🦄','🐢','🦢','🪸','🌈','⭐','✨','🎀','🩷','💖','🤍'];

module.exports = {
    name: "reactsetup",
    aliases: ["reacttest", "setreact"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, adhiqmini, prefix }) {

        // .reactsetup <channel_jid>  (jid ekak dunne nathnam loaded react_channel.json eke first jid eka use karanawa)
        const targetJid = (args[0] && args[0].endsWith('@newsletter'))
            ? args[0]
            : '120363424190766692@newsletter';

        await reply(
            `🛠️ *Newsletter React Listener Started*\n\n` +
            `📰 *Channel:* ${targetJid}\n` +
            `⏱️ *Duration:* 30 minutes\n\n` +
            `_Channel ekata post ekak ennakam wait wenawa. Console log eke "[ReactSetup]" prefix eka balanna._`
        );

        console.log(`🛠️ [ReactSetup] Listener attached for ${targetJid} by owner.`);

        // Make sure this session is actually following the channel —
        // newer WhatsApp servers seem to silently reject reactions on
        // channels the account doesn't follow.
        try {
            await conn.newsletterFollow(targetJid);
            console.log(`✅ [ReactSetup] newsletterFollow(${targetJid}) OK`);
        } catch (fErr) {
            console.warn(`⚠️ [ReactSetup] newsletterFollow(${targetJid}) failed:`, fErr?.message || fErr);
        }

        const reactListener = async (upsert) => {
            try {
                console.log(`🛠️ [ReactSetup] messages.upsert fired | type=${upsert?.type} | count=${upsert?.messages?.length}`);

                for (const msg of (upsert?.messages || [])) {
                    if (!msg?.key?.remoteJid) continue;
                    if (msg.key.remoteJid !== targetJid) continue;

                    console.log(`📰 [ReactSetup] Newsletter message matched on ${targetJid}`);
                    console.log(`🛠️ [ReactSetup] RAW msg =`, JSON.stringify(msg, null, 2));

                    const serverId = extractNewsletterServerId(msg);
                    if (!serverId) {
                        console.warn(`⚠️ [ReactSetup] No server id found on this msg — check the RAW dump above for the right field.`);
                        continue;
                    }

                    const emoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];

                    try {
                        if (typeof conn.newsletterReactMessage === 'function') {
                            await conn.newsletterReactMessage(targetJid, serverId.toString(), emoji);
                        } else {
                            await conn.sendMessage(targetJid, {
                                react: { text: emoji, key: { ...msg.key, id: serverId.toString() } }
                            });
                        }
                        console.log(`✅ [ReactSetup] Reacted with ${emoji} on serverId=${serverId}`);
                        await conn.sendMessage(from, { text: `✅ React success! serverId=${serverId} emoji=${emoji}` }).catch(() => {});
                    } catch (reactErr) {
                        console.error(`❌ [ReactSetup] React FAILED:`, reactErr?.output?.payload || reactErr?.data || reactErr?.stack || reactErr?.message || reactErr);
                        await conn.sendMessage(from, { text: `❌ React failed: ${reactErr?.message || reactErr}` }).catch(() => {});
                    }
                }
            } catch (err) {
                console.error('[ReactSetup] listener error:', err?.stack || err?.message || err);
            }
        };

        conn.ev.on('messages.upsert', reactListener);

        setTimeout(() => {
            conn.ev.off('messages.upsert', reactListener);
            console.log(`🛑 [ReactSetup] Listener removed for ${targetJid} (30 min timeout).`);
        }, 30 * 60 * 1000);
    }
};
