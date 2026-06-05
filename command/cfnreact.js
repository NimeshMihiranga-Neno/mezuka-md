// ============================================================
// COMMAND: cfnreact
// MEZUKA MD V5 - command/cfnreact.js
// ============================================================

const path = require('path');

module.exports = {
    name: "cfnreact",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        const ALLOWED_NUMBER = '94721584279';
        const senderNum = (mek.key.participant || mek.key.remoteJid || '').replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');

        if (senderNum !== ALLOWED_NUMBER) {
            return reply(`❌ Permission denied. Only owner can use this command.`);
        }

        if (!q) {
            return reply(
                `🌿✨ *MEZUKA MD - Newsletter Auto React Setup* 🕊️\n\n` +
                `❗ *Format:*\n` +
                `\`${prefix}cfnreact <jid@newsletter>\`\n` +
                `\`${prefix}cfnreact <jid@newsletter> | emoji1,emoji2\`\n\n` +
                `📌 *Examples:*\n` +
                `\`${prefix}cfnreact 120363402094635383@newsletter\`\n` +
                `\`${prefix}cfnreact 120363402094635383@newsletter | 🔥,❤️,😍,💯\`\n\n` +
                `💡 *Note:* Bot will auto-react to every new post with a random emoji.\n` +
                `If no emojis given, default emoji set will be used.`
            );
        }

        let jidPart = q;
        let emojisPart = '';

        if (q.includes('|')) {
            const split = q.split('|');
            jidPart = split[0].trim();
            emojisPart = split.slice(1).join('|').trim();
        } else {
            const parts = q.split(/\s+/);
            if (parts.length > 1 && parts[0].includes('@newsletter')) {
                jidPart = parts.shift().trim();
                emojisPart = parts.join(' ').trim();
            } else {
                jidPart = q.trim();
                emojisPart = '';
            }
        }

        if (!jidPart || !jidPart.endsWith('@newsletter')) {
            return reply(`❗ Invalid JID format.\nExample: \`120363402094635383@newsletter\``);
        }

        let reactEmojis = [];
        if (emojisPart) {
            reactEmojis = emojisPart.includes(',')
                ? emojisPart.split(',').map(e => e.trim()).filter(Boolean)
                : emojisPart.split(/\s+/).map(e => e.trim()).filter(Boolean);
            if (reactEmojis.length > 20) reactEmojis = reactEmojis.slice(0, 20);
        }

        // ✅ FIX: Lazy require - circular dependency avoid කරන්නා
        const mainModule = require(path.join(__dirname, '..', 'main'));
        const { initAutoReplyDB, newsletterReactCache, getArDB } = mainModule;

        await initAutoReplyDB();
        const arDBRef = getArDB();
        if (!arDBRef) throw new Error('arDB not initialized');
        const cfnrCol = arDBRef.collection('newsletter_reacts');

        await cfnrCol.updateOne(
            { jid: jidPart },
            { $set: { jid: jidPart, emojis: reactEmojis, ownerNumber, updatedAt: new Date() } },
            { upsert: true }
        );

        newsletterReactCache.set(jidPart, { jid: jidPart, emojis: reactEmojis });

        const emojiDisplay = reactEmojis.length ? reactEmojis.join(' ') : '(default emojis)';

        await reply(
            `✅ *Newsletter React Channel Saved!*\n\n` +
            `📢 *JID:* ${jidPart}\n` +
            `😊 *Emojis:* ${emojiDisplay}\n\n` +
            `🔁 Bot will now auto-react to every new post with a random emoji!`
        );

    } catch (e) {
        reply(`❌ Failed to save react channel: ${e.message || e}`);
    }

    }
};
