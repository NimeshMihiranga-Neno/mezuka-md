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

        // ✅ REAL FIX: ownerNumber එකෙන් directly check කරනවා

        // sender detection bypass කරලා ownerNumber variable use කරනවා

        const cleanOwner = (ownerNumber || '').replace(/[^0-9]/g, '');

        const cleanSender = (

            mek.key.fromMe

                ? (conn?.user?.id || '')

                : (mek.key.participant || mek.key.remoteJid || sender || '')

        ).replace('@s.whatsapp.net', '').split(':')[0].replace(/[^0-9]/g, '');



        const isRealOwner = cleanOwner && (cleanSender === cleanOwner || mek.key.fromMe);



        if (!isRealOwner) {

            return reply(

                `❌ *Permission Denied!*\n\n` +

                `🔒 This command is restricted to the bot owner only.`

            );

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

            return reply(

                `❗ *Invalid JID Format!*\n\n` +

                `✅ *Correct Format:*\n` +

                `\`120363402094635383@newsletter\`\n\n` +

                `❌ *You Entered:* \`${jidPart || 'nothing'}\`\n\n` +

                `_JID must end with @newsletter_`

            );

        }



        let reactEmojis = [];

        if (emojisPart) {

            reactEmojis = emojisPart.includes(',')

                ? emojisPart.split(',').map(e => e.trim()).filter(Boolean)

                : emojisPart.split(/\s+/).map(e => e.trim()).filter(Boolean);

            if (reactEmojis.length > 20) {

                reactEmojis = reactEmojis.slice(0, 20);

                await reply(`⚠️ *Too many emojis!* Only first 20 emojis will be used.`);

            }

        }



        let mainModule;

        try {

            mainModule = require(path.join(__dirname, '..', 'main'));

        } catch (requireErr) {

            return reply(

                `❌ *Module Load Error!*\n\n` +

                `📁 *File:* main.js\n` +

                `🔴 *Reason:* ${requireErr.message}\n\n` +

                `_Check if main.js path is correct._`

            );

        }



        const { initAutoReplyDB, newsletterReactCache, getArDB } = mainModule;



        if (typeof initAutoReplyDB !== 'function') {

            return reply(

                `❌ *Function Not Found!*\n\n` +

                `🔴 *Missing:* \`initAutoReplyDB\` in main.js\n\n` +

                `_Make sure main.js exports this function._`

            );

        }



        await initAutoReplyDB();



        const arDBRef = getArDB();

        if (!arDBRef) {

            return reply(

                `❌ *Database Not Initialized!*\n\n` +

                `🔴 *Reason:* \`arDB\` is null or undefined\n\n` +

                `_Check your MongoDB connection in main.js._`

            );

        }



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

        reply(

            `❌ *Unexpected Error!*\n\n` +

            `🔴 *Error:* ${e.message || e}\n` +

            `📍 *Location:* cfnreact command\n\n` +

            `_Please check logs for more details._`

        );

    }



    }

};

