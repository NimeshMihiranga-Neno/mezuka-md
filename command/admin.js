module.exports = {
    name: "admin",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        const dec = `\n••━━━━〔 🖤 𝐁ʟᴀᴄ𝐤 𝐂𝐚𝐭 𝐎𝐅𝐂 〕━━━━••\n\n╭━━━━〔 👥 𝐎𝐔𝐑 𝐓𝐄𝐀𝐌 〕━━━━╮\n┃\n┃ 👑 *𝐎𝐰𝐧𝐞𝐫*\n┃ └ 🖤 Nimeshka Mihiran\n┃\n┃ 🛡️ *𝐀𝐝𝐦𝐢𝐧𝐬*\n┃ ├ 🔥 Thenuja  – Admin\n┃ └ ⚡ Manish   – Admin\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n> © 𝐍𝐢𝐦𝐞𝐬𝐡𝐤𝐚 𝐌𝐢𝐡𝐢𝐫𝐚𝐧 – 𝐁𝐥𝐚𝐜𝐤 𝐂𝐚𝐭 𝐎𝐅𝐂 👑\n`;
        await conn.sendMessage(from, { image: { url: require('../image').ADMIN_CMD }, caption: dec, contextInfo: { mentionedJid: [sender], forwardingScore: 143, isForwarded: true } }, { quoted: adhiqmini });
        await conn.sendMessage(from, { audio: { url: `https://raw.githubusercontent.com/NimeshMihiranga/MEZUKA-MD-MINI-HELLPER-REPO/main/VID-20260307-WA0037.opus` }, mimetype: 'audio/mpeg', ptt: false, contextInfo: { mentionedJid: [sender], forwardingScore: 143, isForwarded: true } }, { quoted: adhiqmini });
        const teamMembers = [
            { name: 'Nimeshka Mihiran 👑 Owner', number: '94700000001' },
            { name: 'Thenuja 🔥 Admin', number: '94700000002' },
            { name: 'Manish ⚡ Admin', number: '94700000003' },
            { name: 'Vinusha 💼 Admin & Team Management', number: '94700000004' },
            { name: 'Nethusha 🌟 Social Media Marketing', number: '94700000005' },
            { name: 'Harshi 💜 Social Media & Helper', number: '94700000006' },
            { name: 'Dewmini 🌸 Users Helping', number: '94700000007' },
        ];
        const contacts = teamMembers.map(({ name, number }) => ({ displayName: name, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:Black Cat OFC;\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD` }));
        await conn.sendMessage(from, { contacts: { displayName: '🖤 Black Cat OFC – Team Contacts', contacts } }, { quoted: adhiqmini });
    } catch (e) { reply(`❌ Error:\n${e.message}`); }
    }
};
