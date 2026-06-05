module.exports = {
    name: "setpp",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const fs = require("fs");
    const path = require("path");
    try {
        if (!isOwner) return reply("❌ You are not the owner!");
        if (!quoted || !quoted.msg || !quoted.msg.url || !quoted.type.includes("image")) return reply("Please reply to an image.");
        const tempFileName = `Mezuka_MD_V4_${Math.random().toString(36).substring(2, 10)}.jpg`;
        const tempFilePath = path.join(__dirname, 'temp', tempFileName);
        const mediaBuffer = await quoted.download();
        if (!mediaBuffer) return reply("❌ Failed to download image.");
        fs.writeFileSync(tempFilePath, mediaBuffer);
        const botJid = conn?.user?.id || conn?.user?.jid;
        if (!botJid) return reply("❌ Cannot detect bot JID!");
        await conn.updateProfilePicture(botJid, { url: tempFilePath });
        reply("✅ Profile picture updated successfully!");
        fs.unlinkSync(tempFilePath);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
    }
};
