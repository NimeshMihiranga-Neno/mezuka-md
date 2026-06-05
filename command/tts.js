module.exports = {
    name: "tts",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const googleTTS = require("google-tts-api");
    try {
        
        await conn.sendMessage(from, { react: { text: '🧚', key: mek.key } });
        if (!q) return reply("Need some text.");
        const url = googleTTS.getAudioUrl(q, { lang: 'hi-IN', slow: false, host: 'https://translate.google.com' });
        await conn.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: adhiqmini });
    } catch (e) { reply(`${e}`); }
    }
};
