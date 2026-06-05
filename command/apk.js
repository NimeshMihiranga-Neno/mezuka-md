module.exports = {
    name: "apk",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {
    const axios = require('axios');
    try {
        await m.react('⬇');
        const url = "http://ws75.aptoide.com/api/7/apps/search/query=" + q + '/limit=1';
        const dl = await axios.get(url);
        const ckk = dl.data;
        let cgttt = ckk.datalist.list[0].size % 0xf4240;
        let cgtwwppp = '.' + cgttt;
        let cgtttgg = ckk.datalist.list[0].size / 0xf4240;
        let cgtttggyy = cgtttgg - cgtwwppp;
        let cgtww = "\n*𝘎𝘰𝘭𝘥𝘦 𝘘𝘶𝘦𝘦𝘯 𝘔𝘋*  \n*🏷️ Nᴀᴍᴇ :* " + ckk.datalist.list[0].name + "\n\n*📦 Sɪᴢᴇ :* " + cgtttggyy + "MB\n\n*🔖 Pᴀᴄᴋᴀɢᴇ :* " + ckk.datalist.list[0]['package'] + "\n\n*📆 Lᴀꜱᴛ Uᴘᴅᴀᴛᴇ :* " + ckk.datalist.list[0].updated + "\n\n*👤 Dᴇᴠᴇʟᴏᴘᴇʀꜱ :* " + ckk.datalist.list[0].developer.name + "\n\n> 𝘎𝘰𝘭𝘥𝘦𝘯 𝘘𝘶𝘦𝘦𝘯 𝘛𝘦𝘢𝘮\n";
        await m.react('⬆');
        await conn.sendMessage(from, { document: { url: ckk.datalist.list[0].file.path_alt }, fileName: ckk.datalist.list[0].name, mimetype: "application/vnd.android.package-archive", caption: cgtww }, { quoted: adhiqmini });
        await m.react('✅');
    } catch (e) { reply('' + e); }
    }
};
