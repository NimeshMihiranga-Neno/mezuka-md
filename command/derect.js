// ============================================================
// COMMAND: derect
// MEZUKA MD V5 - command/derect.js
// ============================================================

module.exports = {
    name: "derect",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        let link = q?.trim();
        if (!link) return reply("Link එකක් දාන්න!");

        if (link.match(/\.(jpg|jpeg|png|gif)$/i)) {
            await conn.sendMessage(from, { image: { url: link } }, { quoted: adhiqmini });
        } else if (link.match(/\.(mp4|mkv|webm)$/i)) {
            await conn.sendMessage(from, { video: { url: link } }, { quoted: adhiqmini });
        } else if (link.match(/\.(webp)$/i)) {
            await conn.sendMessage(from, { sticker: { url: link } }, { quoted: adhiqmini });
        } else {
            reply("Link එකේ file type එක හොඳට බලන්න! Support වෙන්නේ: jpg/png/gif/mp4/mkv/webm/webp විතරයි.");
        }

    } catch (e) {
        reply("Link එකෙන් send කරන්න Error එකක් ආවා.");
    }

    }
};
