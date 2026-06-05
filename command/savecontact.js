// ============================================================
// COMMAND: savecontact
// MEZUKA MD V5 - command/savecontact.js
// ============================================================

module.exports = {
    name: "savecontact",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        const fs = require('fs');
        const path = require('path');
        const ownerNum = conn.user.id.split(':')[0];
        const db = cli.db('CONTACT');
        const dayContactColl = db.collection(`${ownerNum}DAY_CONTACT`);

        const dayContacts = await dayContactColl.find({}).toArray();
        if (dayContacts.length === 0) return reply('❌ No contacts saved today!');

        let vcfContent = '';
        for (const c of dayContacts) {
            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;TYPE=CELL:${c.phone_number}\nEND:VCARD\n`;
        }

        const vcfPath = path.join(__dirname, 'temp', 'today_contacts.vcf');
        fs.writeFileSync(vcfPath, vcfContent, 'utf8');

        await conn.sendMessage(from, {
            document: { url: vcfPath },
            mimetype: 'text/x-vcard',
            fileName: 'Mezuka MD V5.vcf'
        }, { quoted: adhiqmini });

        await dayContactColl.deleteMany({});
        await reply('✅ Today\'s contacts exported as .vcf and cleared from DB.');

        fs.unlinkSync(vcfPath);

    } catch (e) {
        reply('❌ Error exporting contacts.');
    }

    }
};
