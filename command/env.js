module.exports = {
    name: "env",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os, isMe, client }) {
    if (!isMe) return reply('🚫 Only the bot owner can use this command.');
    await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
    try {
        const botNum = conn.user.id.split(':')[0];
        const envSettings = readEnvSync(botNum);
        await client.connect();
        const db = client.db('MEZUKADB');
        const collection = db.collection('SETTINGS');
        const mongoDoc = await collection.findOne({ ownerNumber: botNum });
        let mongoSettings = {};
        if (mongoDoc) { const { _id, ownerNumber: on, ...rest } = mongoDoc; mongoSettings = rest; }
        const combinedSettings = { ...envSettings, ...mongoSettings };

        const entries = Object.entries(combinedSettings);
        const total = entries.length;

        // Settings list build කරනවා
        let settingsList = '';
        entries.forEach(([key, value], i) => {
            const isLast = i === total - 1;
            const connector = isLast ? '╰' : '├';
            const val = String(value).length > 30 ? String(value).slice(0, 30) + '...' : value;
            settingsList += `${connector}─ 🔹 *${key}:* \`${val}\`\n`;
        });

        const msg = `
╭━━━〔 ⚙️ *𝑩𝑶𝑻 𝑺𝑬𝑻𝑻𝑰𝑵𝑮𝑺* ⚙️ 〕━━━╮
┃
┃ 🤖 *Bot Number:* \`${botNum}\`
┃ 📦 *Total Settings:* \`${total}\`
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 📋 *Config List* 〕━━╮
${settingsList}
╭━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🌸 *Mezuka MD V5* | © 2026
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        reply(msg);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`╭━━〔 ❌ *Error* 〕━━╮\n┃ ${e.message}\n╰━━━━━━━━━━━━━━━╯`);
    }
    finally { try { await client.close(); } catch (_) {} }
    }
};
