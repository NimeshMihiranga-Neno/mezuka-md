// ============================================================
// COMMAND: viewcontact
// MEZUKA MD V5 - command/viewcontact.js
// ============================================================

module.exports = {
    name: "viewcontact",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    try {
        

        const ownerNum = conn.user.id.split(':')[0];
        const db = cli.db('CONTACT');
        const myContactColl = db.collection(`${ownerNum}MY_CONTACT`);
        const dayContactColl = db.collection(`${ownerNum}DAY_CONTACT`);

        const myContactCount = await myContactColl.countDocuments();
        const dayContactCount = await dayContactColl.countDocuments();
        const dayContacts = await dayContactColl.find({}).toArray();
        const phoneList = dayContacts.map(c => `• ${c.phone_number} - ${c.name}`).join('\n');

        await reply(`*📋 My Contact Stats*\n\n✅ Old Contact Store: ${myContactCount}\n📆 Today Saved Contacts: ${dayContactCount}\n\n🗂️ *Today's Contacts List:*\n${phoneList || '_No contacts saved today_'}`);

    } catch (e) {
        reply('❌ Error fetching contacts.');
    }

    }
};
