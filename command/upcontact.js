// ============================================================
// COMMAND: upcontact
// MEZUKA MD V5 - command/upcontact.js
// ============================================================

module.exports = {
    name: "upcontact",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    async function streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }

    try {
        

        const ownerNum = conn.user.id.split(':')[0];

        if (!quoted) return reply('❌ Reply to a .vcf file to import contacts!');

        const stream = await conn.downloadStream(m.quoted.message.documentMessage);
        const buffer = await streamToBuffer(stream);
        const vcfContent = buffer.toString('utf-8');

        const contacts = [];
        const vcardBlocks = vcfContent.split('BEGIN:VCARD').slice(1);
        for (const block of vcardBlocks) {
            const fnMatch = block.match(/FN:(.*)/);
            const telMatch = block.match(/TEL.*:(.*)/);
            if (fnMatch && telMatch) {
                contacts.push({ name: fnMatch[1].trim(), phone_number: telMatch[1].trim() });
            }
        }

        if (contacts.length === 0) return reply('❌ No contacts found in the VCF file.');

        const db = cli.db('CONTACT');
        const myContactColl = db.collection(`${ownerNum}MY_CONTACT`);

        await myContactColl.deleteMany({});

        let added = 0;
        for (const c of contacts) {
            await myContactColl.insertOne({ phone_number: c.phone_number, name: c.name });
            added++;
        }

        await reply(`✅ *Contacts Import Completed*\n🗑️ Old contacts cleared\n➕ Newly Added: ${added}`);

    } catch (e) {
        reply(e.message);
    }

    }
};
