module.exports = {
    name: "ping",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

try {
    const ggg = conn.user.id.split(':')[0]
    const ModeData = readEnvSync(ggg);
    const Mode = ModeData.MODE || 'private';
    const NENO_LAN = ModeData.NENO_LAN || 'EN';
    const SUDO = ModeData.SUDO || '';
    const SUDON = SUDO.split(",");

    if (!isOwner) {
        if (Mode === 'private' && !(SUDON.includes(m.sender) || SUDON.includes(from))) {
            if (NENO_LAN === 'SI') {
                return reply(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮
┃ ✨ ඔබට මෙම බොට් භාවිතා කළ නොහැක
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆

🌸 *ඔබටත් බොට් එකක් නොමිලේ ලබා ගන්න!*

💫 පහල ලින්ක් එකට ගොස්
🔗 Pair කර Connect කරගන්න 👇👇👇

🌐 nimeshmihiranga.github.io/mezukasite/

╭───────────────╮
│ 🌸 Powered By Black Cat Ofc
│ © Mezuka MD V5 2026
╰───────────────╯`);
            } else {
                return reply(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮
┃ ✨ You Cannot Use This Bot
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆

🌸 *Get Your Own Free Bot Now!*

💫 Go to the link below
🔗 Pair & Connect 👇👇👇

🌐 nimeshmihiranga.github.io/mezukasite/

╭───────────────╮
│ 🌸 Powered By Black Cat Ofc
│ © Mezuka MD V5 2026
╰───────────────╯`);
            }
        }
    }

    const pongMessages = [
        "🏓 *Pong! Right Back At Ya~* 💖",
        "💫 *Signal Received, Cutie~* 🌸",
        "🎀 *Pong! I Heard You~* ✨",
        "🌸 *Aww You Called Me?* 💌",
        "⚡ *Zap! I'm Right Here~* 🌟",
        "🍓 *Pong! Miss Me?* 💫",
        "🌙 *Hey Hey~ I'm Here!* 🌸",
        "💖 *Pong! Always Here For You~* ✨",
        "🎵 *Beep Boop~ Online!* 🤖",
        "🌺 *Pong! Catch Me If You Can~* 💨",
        "✨ *Oh You Pinged Me? Cute~* 🎀",
        "🍡 *Pong Pong~ Here I Am!* 🌸",
    ];

    const randomPong = pongMessages[Math.floor(Math.random() * pongMessages.length)];

    var inital = new Date().getTime();
    await new Promise(r => setTimeout(r, 1));
    var final = new Date().getTime();

    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const caption = `${randomPong}\n\n⚡ *${final - inital} ms* | 🕐 *${runtime()}*\n📅 *${date}* | 🕰️ *${time}*\n${(final - inital) < 200 ? '🚀 Super Fast!' : (final - inital) < 500 ? '⚡ Pretty Fast~' : '🐢 A lil Slow uwu'}`;

    return await conn.sendMessage(from, {
        text: caption,
        contextInfo: {
            externalAdReply: {
                title: "Mezuka MD V5✻",
                body: "Powered By Black Cat Ofc",
                thumbnailUrl: "https://files.catbox.moe/lt36jy.jpg", // 👈 ඔයාගේ catbox url එක දාන්න
                sourceUrl: "https://nimeshmihiranga.github.io/mezukasite/",
                mediaType: 1,
                renderLargerThumbnail: false
            },
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        }
    }, { quoted: mek });

} catch (e) {
    reply('*Error !!*');
    console.log(e);
}

    }
}
