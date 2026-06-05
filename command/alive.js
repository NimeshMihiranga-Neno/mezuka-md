// ============================================================
// COMMAND: alive
// MEZUKA MD V5 - command/alive.js
// ============================================================

module.exports = {
    name: "alive",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {


    try {


        await m.react('🌹');

        let hostname;
        if (os.hostname().length == 12) hostname = 'replit';
        else if (os.hostname().length == 36) hostname = 'heroku';
        else if (os.hostname().length == 8) hostname = 'koyeb';
        else hostname = os.hostname();

        const ownerNumber = conn.user.id.split(':')[0];
        const vvv = readEnvSync(ownerNumber);

        const ALIVE_LOGO = vvv.ALIVE_LOGO || require('../image').DEFAULT_LOGO;
        const ALIVE_MSG = vvv.ALIVE_MSG || "𝐈 𝐀𝐌 𝐎𝐍𝐋𝐈𝐍𝐄 🌸";

        const snm = `
🌹⃝⃘̉̉̉̉̉̉🧚‍♀️ *ʜᴇʟʟᴏ ${pushname}* 🧚‍♀️🌹⃝⃘̉̉̉̉̉̉

┊ ┊ ✫ ˚♡ ⋆｡❀
┊ ☪︎⋆

> 🌿 *ᴠᴇʀsɪᴏɴ :* ${require("../package.json").version}
> 💫 *ᴍᴇᴍᴏʀʏ :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
> ⏳ *ʀᴜɴᴛɪᴍᴇ :* ${runtime(process.uptime())}
> 🌐 *ʜᴏsᴛ :* ${hostname}

🧚‍♀️ *${ALIVE_MSG}*

*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ3* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

        const isImage = ALIVE_LOGO.match(/\.(jpg|jpeg|png|webp)$/i);

        await conn.sendMessage(from, {
            [isImage ? 'image' : 'video']: { url: ALIVE_LOGO },
            caption: snm,
            gifPlayback: true,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: adhiqmini });

        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/NimeshMihiranga-Neno/Mezuka-help/raw/main/ReelAudio-44348.mp3' },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: adhiqmini });

    } catch (e) {
        reply(e);
        console.log('Error details:', e);
    }

    }
};
