module.exports = {
    name: "owner",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    try {
        
        const dec = `\n••━━━━〔 🖤 𝐁ʟᴀᴄ𝐤 𝐂𝐚𝐭 𝐎𝐅𝐂 〕━━━━••\n\n╭━━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 〕━━━━╮\n┃\n┃ 🖤 *𝐍𝐚𝐦𝐞*  : 𝐍𝐢𝐦𝐞𝐬𝐡𝐤𝐚 𝐌𝐢𝐡𝐢𝐫𝐚𝐧  \n┃ 👑 *𝐑𝐨𝐥𝐞*  : 𝐎𝐰𝐧𝐞𝐫 – 𝐁𝐥𝐚𝐜𝐤 𝐂𝐚𝐭 𝐎𝐅𝐂  \n┃ 🌍 *𝐅𝐫𝐨𝐦*  : 𝐒𝐫𝐢 𝐋𝐚𝐧𝐤𝐚  \n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n> © 𝐍𝐢𝐦𝐞𝐬𝐡𝐤𝐚 𝐌𝐢𝐡𝐢𝐫𝐚𝐧 – 𝐁𝐥𝐚𝐜𝐤 𝐂𝐚𝐭 𝐎𝐅𝐂 👑\n`;
        await conn.sendMessage(from, { image: { url: require('../image').OWNER_CMD }, caption: dec, contextInfo: { mentionedJid: [sender], forwardingScore: 143, isForwarded: true } }, { quoted: adhiqmini });
        const ownerNumbers = [
            { name: 'Nimeshka Mihiran 🖤 Owner', number: '94721584279' },
            { name: 'Nimeshka Mihiran 👑 No.2', number: '94760771665' },
            { name: 'Nimeshka Mihiran 🌍 No.3', number: '94726228243' },
        ];
        const contacts = ownerNumbers.map(({ name, number }) => ({ displayName: name, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:Black Cat OFC;\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD` }));
        await conn.sendMessage(from, { contacts: { displayName: '👑 Mezuka MD V5 - Owner Contacts', contacts } }, { quoted: adhiqmini });
    } catch (e) { reply(`❌ Error:\n${e.message}`); }
    }
};
