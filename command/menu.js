module.exports = {
    name: "menu",
    aliases: [],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

try {
    await m.react('💤');
    const botNumber = conn.user.id.split(':')[0]
    const vvv = readEnvSync(botNumber);
    const menulogo = vvv.MENU_LOGO || require('../image').DEFAULT_LOGO;
    const prefix = vvv.PRIFIX || "."
    const NENO_LAN = vvv.NENO_LAN || 'EN';
    const BOT_NAME = vvv.BOT_NAME || "𝐌ᴇᴢᴜᴋᴀ 𝐌ᴅ";

    const isSI = NENO_LAN === 'SI';

    // ════════════════════════════════════════════════════════════════
    // COMMAND CONFIG — අලුත් command add කරන්න මෙතනට line එකක් දාන්න
    // ════════════════════════════════════════════════════════════════
    const COMMANDS = {
        MAIN: [
            { cmd: 'alive',     emoji: '🤖', desc_si: 'බොට් ක්‍රියාකාරීද යන්න පරීක්ෂා කිරීමට',  desc_en: 'Check if the bot is active' },
            { cmd: 'ping',      emoji: '🏓', desc_si: 'බොට්ගේ ප්‍රතිචාර වේලාව දැනගැනීමට',        desc_en: 'Check the bot response time' },
            { cmd: 'menu',      emoji: '📋', desc_si: 'සම්පූර්ණ මෙනු ලිස්ට් ලබාගැනීමට',          desc_en: 'Get the full command menu' },
            { cmd: 'vv',        emoji: '👁️', desc_si: 'View Once Messages ඇරලා දකිනීමට',         desc_en: 'View once messages' },
            { cmd: 'save',      emoji: '💾', desc_si: 'Status සේව් කිරීමට',                       desc_en: 'Save status media' },
            { cmd: 'jid',       emoji: '🆔', desc_si: 'Chat JID ලබාගැනීමට',                      desc_en: 'Get chat JID' },
            { cmd: 'getpp',     emoji: '🖼️', desc_si: 'Profile Picture ලබාගැනීමට',               desc_en: 'Get profile picture' },
            { cmd: 'setpp',     emoji: '🎨', desc_si: 'බොට්ගේ DP වෙනස් කිරීමට',                 desc_en: 'Change bot display picture' },
            { cmd: 'derect',    emoji: '🔗', desc_si: 'URL Direct ලෙස Send කිරීමට',              desc_en: 'Send URL directly' },
            { cmd: 'pair',      emoji: '🔑', desc_si: 'Pair Code ලබාගැනීමට',                     desc_en: 'Get pair code' },
            { cmd: 'owner',     emoji: '👑', desc_si: 'Owner Info ලබාගැනීමට',                    desc_en: 'Get owner info' },
            { cmd: 'rmbg',      emoji: '✂️', desc_si: 'Image Background Remove කිරීමට',          desc_en: 'Remove image background' },
            { cmd: 'passpaper', emoji: '📄', desc_si: 'Past Papers ලබාගැනීමට',                   desc_en: 'Get past papers' },
        ],
        DOWNLOAD: [
            { cmd: 'song / play / music / s', emoji: '🎵', desc_si: 'YouTube MP3 ලෙස ගීතය බාගන්නට',   desc_en: 'Download YouTube audio as MP3',  ex_si: 'song Chillout',   ex_en: 'song Chillout' },
            { cmd: 'video / vid / v',         emoji: '🎬', desc_si: 'YouTube Video බාගන්නට',           desc_en: 'Download YouTube video',         ex_si: 'video link',      ex_en: 'video Funny Clip' },
            { cmd: 'animedl',  emoji: '🎌', desc_si: 'Anime බාගන්නට',            desc_en: 'Download anime',               ex_si: 'animedl naruto',  ex_en: 'animedl naruto' },
            { cmd: 'tiktok',   emoji: '🎵', desc_si: 'TikTok Video බාගන්නට',     desc_en: 'Download TikTok video',        ex_si: 'tiktok [link]',   ex_en: 'tiktok [link]' },
            { cmd: 'fb',       emoji: '📘', desc_si: 'Facebook Video බාගන්නට',   desc_en: 'Download Facebook video',      ex_si: 'fb [link]',       ex_en: 'fb [link]' },
            { cmd: 'gdrive',   emoji: '☁️', desc_si: 'Google Drive File බාගන්නට', desc_en: 'Download Google Drive file',  ex_si: 'gdrive [link]',   ex_en: 'gdrive [link]' },
            { cmd: 'ig',       emoji: '📸', desc_si: 'Instagram Video බාගන්නට',  desc_en: 'Download Instagram video',     ex_si: 'ig [link]',       ex_en: 'ig [link]' },
            { cmd: 'movie',    emoji: '🎟️', desc_si: 'movie බාගන්නට',  desc_en: 'Download movie sinhalasubs',     ex_si: 'movie [name]',       ex_en: 'movie [name]' },
            { cmd: 'cartoon',       emoji: '🧃', desc_si: 'cartoon බාගන්නට',  desc_en: 'Download cartoon',     ex_si: 'cartoon',       ex_en: 'cartoon' },



        ],
        CONVERT: [
            { cmd: 'sticker',  emoji: '🖼️', desc_si: 'Image එකක් Sticker එකක් කිරීමට',    desc_en: 'Convert image to sticker',         ex_si: 'sticker (image reply)',  ex_en: 'sticker (reply to image)' },
            { cmd: 'rsticker', emoji: '⭕', desc_si: 'Round Sticker එකක් සාදනවා',          desc_en: 'Create a round sticker',           ex_si: 'rsticker (image reply)', ex_en: 'rsticker (reply to image)' },
            { cmd: 'toimg',    emoji: '📷', desc_si: 'Sticker එකක් Image කිරීමට',          desc_en: 'Convert sticker to image',         ex_si: 'toimg (sticker reply)',  ex_en: 'toimg (reply to sticker)' },
            { cmd: 'tomp3',    emoji: '🎵', desc_si: 'Video එකක් MP3 කිරීමට',              desc_en: 'Convert video to MP3',             ex_si: 'tomp3 (video reply)',    ex_en: 'tomp3 (reply to video)' },
            { cmd: 'tourl',    emoji: '🔗', desc_si: 'Image එකක් ImgBB URL කිරීමට',        desc_en: 'Upload image to ImgBB URL',        ex_si: 'tourl (image reply)',    ex_en: 'tourl (reply to image)' },
            { cmd: 'url',      emoji: '📎', desc_si: 'Media එකක් Catbox URL කිරීමට',       desc_en: 'Upload media to Catbox URL',       ex_si: 'url (media reply)',      ex_en: 'url (reply to media)' },
            { cmd: 'tts',      emoji: '🗣️', desc_si: 'Text ශබ්දයට හරවනවා',                desc_en: 'Convert text to speech',           ex_si: 'tts ආයුබෝවන්',          ex_en: 'tts Hello World' },
            { cmd: 'ttp',      emoji: '✍️', desc_si: 'Text Sticker එකක් සාදනවා',           desc_en: 'Create a text sticker',            ex_si: 'ttp Hello',              ex_en: 'ttp Hello' },
            { cmd: 'attp',     emoji: '✨', desc_si: 'Animated Text Sticker සාදනවා',        desc_en: 'Create an animated text sticker',  ex_si: 'attp Hello',             ex_en: 'attp Hello' },
            { cmd: 'fancy',    emoji: '🎨', desc_si: 'Fancy Text ලෙස හරවනවා',              desc_en: 'Convert text to fancy style',      ex_si: 'fancy Hello',            ex_en: 'fancy Hello' },
            { cmd: 'emojimix', emoji: '🔀', desc_si: 'Emoji දෙකක් Mix කිරීමට',             desc_en: 'Mix two emojis together',          ex_si: 'emojimix 😂+😍',         ex_en: 'emojimix 😂+😍' },
        ],
        OWNER: [
            { cmd: 'restart1', emoji: '🔄', desc_si: 'බොට් Restart කිරීමට',               desc_en: 'Restart the bot' },
            { cmd: 'setpp',    emoji: '🎨', desc_si: 'බොට්ගේ DP වෙනස් කිරීමට',            desc_en: 'Change bot display picture',      ex_si: 'setpp (image reply)',  ex_en: 'setpp (reply to image)' },
            { cmd: 'pair',     emoji: '🔑', desc_si: 'Pair Code ලබාගැනීමට',                desc_en: 'Get pair code',                   ex_si: 'pair 94xxxxxxxx',     ex_en: 'pair 94xxxxxxxx' },
            { cmd: 'owner',    emoji: '👑', desc_si: 'Owner Info ලබාගැනීමට',               desc_en: 'Get owner info' },
            { cmd: 'ss',       emoji: '📸', desc_si: 'Website Screenshot ගැනීමට',          desc_en: 'Take a website screenshot',       ex_si: 'ss [url]',            ex_en: 'ss [url]' },
            { cmd: 'google',   emoji: '🔍', desc_si: 'Google Search කිරීමට',               desc_en: 'Search on Google',                ex_si: 'google Sri Lanka',    ex_en: 'google Sri Lanka' },
            { cmd: 'img',      emoji: '🖼️', desc_si: 'Image Search කිරීමට',                desc_en: 'Search for images',               ex_si: 'img Sunset',          ex_en: 'img Sunset' },
            { cmd: 'anime',    emoji: '🎌', desc_si: 'Anime Download කිරීමට',               desc_en: 'Download anime',                  ex_si: 'anime Naruto',        ex_en: 'anime Naruto' },
            { cmd: 'send',     emoji: '📤', desc_si: 'Status Download කිරීමට',              desc_en: 'Download status media',           ex_si: 'send (status reply)', ex_en: 'send (reply to status)' },
            { cmd: 'gmdp',     emoji: '👥', desc_si: 'සියලු Group DP ලබාගැනීමට',           desc_en: 'Get all group display pictures' },
            { cmd: 'megaup',   emoji: '☁️', desc_si: 'Mega Upload කිරීමට',                 desc_en: 'Upload to Mega',                  ex_si: 'megaup (file reply)', ex_en: 'megaup (reply to file)' },
            { cmd: 'cinfo',    emoji: '📢', desc_si: 'Channel Info ලබාගැනීමට',             desc_en: 'Get channel info' },
            { cmd: 'cid',      emoji: '🆔', desc_si: 'Channel ID ලබාගැනීමට',               desc_en: 'Get channel ID' },
            { cmd: 'creact',   emoji: '💬', desc_si: 'Channel React කිරීමට',               desc_en: 'React on channel' },
        ],
        SCHOOL: [
            { cmd: 'passpaper', emoji: '📄', desc_si: 'Past Papers ලබාගැනීමට',          desc_en: 'Get past papers' },
            { cmd: 'trt',       emoji: '🌐', desc_si: 'Text Translate කිරීමට',           desc_en: 'Translate text',                  ex_si: 'trt si Hello',        ex_en: 'trt si Hello' },
            { cmd: 'tts',       emoji: '🗣️', desc_si: 'Text ශබ්දයට හරවනවා',             desc_en: 'Convert text to speech',          ex_si: 'tts ආයුබෝවන්',       ex_en: 'tts Hello World' },
            { cmd: 'google',    emoji: '🔍', desc_si: 'Google Search කිරීමට',            desc_en: 'Search on Google',                ex_si: 'google AI කියන්නේ?', ex_en: 'google What is AI' },
            { cmd: 'img',       emoji: '🖼️', desc_si: 'Image Search කිරීමට',             desc_en: 'Search for images',               ex_si: 'img Sri Lanka Map',   ex_en: 'img Sri Lanka Map' },
            { cmd: 'anime',     emoji: '🎌', desc_si: 'Anime Download කිරීමට',            desc_en: 'Download anime',                  ex_si: 'anime One Piece',     ex_en: 'anime One Piece' },
            { cmd: 'rmbg',      emoji: '✂️', desc_si: 'Image Background Remove කිරීමට',  desc_en: 'Remove image background',         ex_si: 'rmbg (image reply)',  ex_en: 'rmbg (reply to image)' },
            { cmd: 'fancy',     emoji: '🎨', desc_si: 'Fancy Text ලෙස හරවනවා',           desc_en: 'Convert text to fancy style',     ex_si: 'fancy MEZUKA',        ex_en: 'fancy MEZUKA' },
            { cmd: 'emojimix',  emoji: '🔀', desc_si: 'Emoji දෙකක් Mix කිරීමට',          desc_en: 'Mix two emojis together',         ex_si: 'emojimix 😂+😍',      ex_en: 'emojimix 😂+😍' },
            { cmd: 'ttp',       emoji: '✍️', desc_si: 'Text Sticker එකක් සාදනවා',        desc_en: 'Create a text sticker',           ex_si: 'ttp MEZUKA',          ex_en: 'ttp MEZUKA' },
            { cmd: 'attp',      emoji: '✨', desc_si: 'Animated Text Sticker සාදනවා',     desc_en: 'Create an animated text sticker', ex_si: 'attp MEZUKA',         ex_en: 'attp MEZUKA' },
            { cmd: 'code', emoji: '🧃', desc_si: 'Ai codeing මොඩලය', desc_en: 'English description', ex_si: 'Ai code editer', ex_en: '.code <promt>' },
        ],
        GROUP: [
            { cmd: 'kick',      emoji: '🚫', desc_si: 'Member කෙනෙකු Group එකෙන් Kick කිරීමට', desc_en: 'Kick a member from the group',      ex_si: 'kick (reply/tag)',    ex_en: 'kick (reply/tag)' },
            { cmd: 'add',       emoji: '➕', desc_si: 'Member කෙනෙකු Group එකට Add කිරීමට',    desc_en: 'Add a member to the group',         ex_si: 'add 94xxxxxxxx',     ex_en: 'add 94xxxxxxxx' },
            { cmd: 'promote',   emoji: '👑', desc_si: 'Member කෙනෙකු Admin කිරීමට',            desc_en: 'Promote a member to admin',         ex_si: 'promote (reply/tag)', ex_en: 'promote (reply/tag)' },
            { cmd: 'demote',    emoji: '👤', desc_si: 'Admin කෙනෙකු Normal Member කිරීමට',     desc_en: 'Demote an admin to member',         ex_si: 'demote (reply/tag)', ex_en: 'demote (reply/tag)' },
            { cmd: 'mute',      emoji: '🔇', desc_si: 'Group එක Mute කිරීමට',                  desc_en: 'Mute the group (admin only mode)' },
            { cmd: 'unmute',    emoji: '🔊', desc_si: 'Group එක Unmute කිරීමට',                desc_en: 'Unmute the group' },
            { cmd: 'gname',     emoji: '✏️', desc_si: 'Group නම වෙනස් කිරීමට',                 desc_en: 'Change the group name',             ex_si: 'gname New Name',     ex_en: 'gname New Name' },
            { cmd: 'gdesc',     emoji: '📝', desc_si: 'Group Description වෙනස් කිරීමට',        desc_en: 'Change the group description',      ex_si: 'gdesc New Desc',     ex_en: 'gdesc New Desc' },
            { cmd: 'glink',     emoji: '🔗', desc_si: 'Group Invite Link ලබාගැනීමට',           desc_en: 'Get the group invite link' },
            { cmd: 'resetlink', emoji: '🔄', desc_si: 'Group Invite Link Reset කිරීමට',        desc_en: 'Reset the group invite link' },
            { cmd: 'ginfo',     emoji: 'ℹ️', desc_si: 'Group Info ලබාගැනීමට',                  desc_en: 'Get group info' },
            { cmd: 'members',   emoji: '👥', desc_si: 'Group Members List ලබාගැනීමට',          desc_en: 'Get group members list' },
            { cmd: 'tagall',    emoji: '📢', desc_si: 'සියලු Members Tag කිරීමට',              desc_en: 'Tag all members' },
            { cmd: 'tagadmin',  emoji: '👑', desc_si: 'සියලු Admins Tag කිරීමට',               desc_en: 'Tag all admins' },
            { cmd: 'delete',    emoji: '🗑️', desc_si: 'Message Delete කිරීමට',                 desc_en: 'Delete a message',                  ex_si: 'del (reply)',         ex_en: 'del (reply to message)' },
            { cmd: 'announce',  emoji: '📣', desc_si: 'Group Announce Mode Toggle කිරීමට',     desc_en: 'Toggle group announce mode' },
            { cmd: 'gstatus',   emoji: '📊', desc_si: 'Group Status ලබාගැනීමට',                desc_en: 'Get group status' },
        ],
    };

    // ════════════════════════════════════════
    // HEADER TEMPLATE
    // ════════════════════════════════════════
    const buildHeader = (titleEmoji, titleText) =>
`🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     ${titleEmoji} *${titleText}*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸`;

    const buildFooter = () =>
`━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // COMMAND LIST BUILDER
    // ════════════════════════════════════════
    const buildCmdList = (cmds) => cmds.map(c => {
        const ex = isSI ? (c.ex_si || c.cmd) : (c.ex_en || c.cmd);
        const desc = isSI ? c.desc_si : c.desc_en;
        return `${c.emoji} ${prefix}${c.cmd}\n➤ ${isSI ? 'උදා' : 'Ex'}: \`${prefix}${ex}\`\n${desc} ✅`;
    }).join('\n\n');

    // ════════════════════════════════════════
    // STATUS 0 — Settings
    // ════════════════════════════════════════
    let status0 = `${buildHeader('⚙️', 'SETTINGS COMMANDS')}

*🟢 ${isSI ? 'ʏᴏᴜ ɴᴇᴇᴅ ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ' : 'ʏᴏᴜ ɴᴇᴇᴅ ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ'}*

1. ɢᴏ ᴛᴏ ᴡᴇʙ ꜱɪᴛᴇ >> mezukamd.kozow.com
2. ᴇɴᴛᴇʀ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ ᴀɴᴅ ᴘᴀꜱꜱᴡᴏʀᴅ
3. ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ
4. ꜱᴀᴠᴇ ꜱᴇᴛᴛɪɴɢꜱ
${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 1 — Main Commands
    // ════════════════════════════════════════
    let status1 = `${buildHeader('✨', 'MAIN COMMANDS')}

${buildCmdList(COMMANDS.MAIN)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 2 — Download Commands
    // ════════════════════════════════════════
    let status2 = `${buildHeader('📥', 'DOWNLOAD COMMANDS')}

${buildCmdList(COMMANDS.DOWNLOAD)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 3 — Convert Commands
    // ════════════════════════════════════════
    let status3 = `${buildHeader('🔄', 'CONVERT COMMANDS')}

${buildCmdList(COMMANDS.CONVERT)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 4 — Owner Commands
    // ════════════════════════════════════════
    let status4 = `${buildHeader('👑', 'OWNER COMMANDS')}

${buildCmdList(COMMANDS.OWNER)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 5 — School & Special Commands
    // ════════════════════════════════════════
    let status5 = `${buildHeader('🎓', 'SCHOOL & SPECIAL COMMANDS')}

${buildCmdList(COMMANDS.SCHOOL)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // STATUS 6 — Group Admin Commands
    // ════════════════════════════════════════
    let status6 = `${buildHeader('🛡️', 'TEAM ADMIN COMMANDS')}

${buildCmdList(COMMANDS.GROUP)}

${buildFooter()}`;

    // ════════════════════════════════════════
    // MAIN MENU
    // ════════════════════════════════════════
    const totalRAM = Math.round(require('os').totalmem() / 1024 / 1024);
    const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const now = new Date();
    const offsetMs = 5.5 * 60 * 60 * 1000;
    const sriLankaTime = new Date(now.getTime() + offsetMs);
    const hours = String(sriLankaTime.getHours()).padStart(2, '0');
    const minutes = String(sriLankaTime.getMinutes()).padStart(2, '0');
    const seconds = String(sriLankaTime.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    function getGreeting() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const slTime = new Date(utc + (5.5 * 60 * 60 * 1000));
        const hour = slTime.getHours();
        if (isSI) {
            if (hour >= 5 && hour < 12) return "*සුභ උදෑසනක්* ⛅";
            else if (hour >= 12 && hour < 17) return "*සුභ දහවලක්* 🌤️";
            else if (hour >= 17 && hour < 21) return "*සුභ සන්ධ්‍යාවක්* 🌥️";
            else return "*සුභ රාත්‍රියක්* 🌙";
        } else {
            if (hour >= 5 && hour < 12) return "*𝘎𝘰𝘰𝘥 𝘔𝘰𝘳𝘯𝘪𝘯𝘨* ⛅";
            else if (hour >= 12 && hour < 17) return "*𝘎𝘰𝘰𝘥 𝘈𝘧𝘵𝘦𝘳𝘯𝘰𝘰𝘯* 🌤️";
            else if (hour >= 17 && hour < 21) return "*𝘎𝘰𝘰𝘥 𝘌𝘷𝘦𝘯𝘪𝘯𝘨* 🌥️";
            else return "*𝘎𝘰𝘰𝘥 𝘕𝘪𝘨𝘩𝘵* 🌙";
        }
    }

    let status = `
🌹⃝⃘̉̉̉̉̉̉🧚 *${BOT_NAME}*
━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊ ⋆｡ ❀⋆｡ ☪︎⋆
┊ ┊ ✫ ˚♡ ⋆｡ ✧
┊ ☪︎⋆ ${getGreeting()}
┊ *${timeString}*
✧

🌝 ${isSI ? 'ලස්සන දවසක් ගෙවෙනා ⍢' : 'ʜᴀᴠᴇ ᴀ ɴɪᴄᴇ ᴅᴀʏ ⍢'}
꒰ ˘͈ᵕ˘͈ ꒱ *${isSI ? 'සෙන්පායි' : 'ꜱᴇɴᴘᴀɪ'}* ${isSI ? 'ඔබව සාදරයෙන් පිළිගනිමු~' : 'ʟᴀ ᴡᴇʟᴄᴏᴍᴇ~'}

╭─「 🎀 *ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ* 」
│ ⏰ » *Uptime:* ${runtime(process.uptime())}
│ 💾 » *Used:* ${usedRAM} MB
│ 💽 » *Total:* ${totalRAM} MB
│ 👑 » ᴛᴇᴀᴍ ʙʟᴀᴄᴋ ᴄᴀᴛꜱ
│ 🌐 » mezukamd.kozow.com
╰──────────────────

╭─「 🌸 *ᴍᴇɴᴜ ʟɪꜱᴛ* 」
│ *0️⃣* » ⚙️ ꜱᴇᴛᴛɪɴɢꜱ ᴄᴍᴅ
│ *1️⃣* » ✨ ᴍᴀɪɴ ᴄᴍᴅ
│ *2️⃣* » 📥 ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴍᴅ
│ *3️⃣* » 🔄 ᴄᴏɴᴠᴇʀᴛ ᴄᴍᴅ
│ *4️⃣* » 👑 ᴏᴡɴᴇʀ ᴄᴍᴅ
│ *5️⃣* » 🎓 ꜱᴄʜᴏᴏʟ & ꜱᴘᴇᴄɪᴀʟ
│ *6️⃣* » 🛡️ ᴛᴇᴀᴍ ᴀᴅᴍɪɴ ᴄᴍᴅ
╰──────────────────

┊ ┊ ✫ ˚♡ ⋆｡
┊ ☪︎⋆ ❀
🦋 *${isSI ? 'අංකයෙන් Reply කරන්න!' : 'ɴᴜᴍʙᴇʀ ʀᴇᴘʟʏ ᴋᴀʀᴀɴɴ!'}* 🌸
꒰ ˘͈ᵕ˘͈ ꒱ ᴍᴇᴢᴜᴋᴀ ʟᴏᴠᴇꜱ ʏᴏᴜ 💕
*┌───────────────┐*
*│© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*
*└───────────────┘*`;

    const isImage = menulogo.endsWith('.jpg') || menulogo.endsWith('.jpeg') || menulogo.endsWith('.png');

    const sentMsg = await conn.sendMessage(from, {
        [isImage ? 'image' : 'video']: { url: menulogo },
        caption: status,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: BOT_NAME,
                serverMessageId: 143
            }
        }
    }, { quoted: adhiqmini });

    await conn.sendMessage(from, {
        audio: { url: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/InShot_20260612_115919021.mp3' },
        mimetype: "audio/mp4",
        ptt: false
    }, { quoted: adhiqmini });

    const menuListener = async (msgUpdate) => {
        try {
            const msg = msgUpdate.messages[0];
            if (!msg || !msg.message) return;

            const msgText = msg.message?.conversation ||
                            msg.message?.extendedTextMessage?.text || '';
            const selectedOption = msgText.trim();

            const contextStanzaId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId ||
                                    msg.message?.conversation && null;

            if (!contextStanzaId || contextStanzaId !== sentMsg.key.id) return;

            const statusMap = {
                '0': status0,
                '1': status1,
                '2': status2,
                '3': status3,
                '4': status4,
                '5': status5,
                '6': status6
            };

            if (statusMap[selectedOption] !== undefined) {
                await conn.sendMessage(from, {
                    image: { url: menulogo },
                    caption: statusMap[selectedOption],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363424190766692@newsletter',
                            newsletterName: BOT_NAME,
                            serverMessageId: 143
                        }
                    }
                }, { quoted: msg });

                conn.ev.off('messages.upsert', menuListener);
            } else {
                const errMsg = isSI
                    ? "වලංගු නොවන option. කරුණාකර 0-6 අතර අංකයක් Reply කරන්න."
                    : "Invalid option. Please reply with a number between 0-6.";
                reply(errMsg);
            }
        } catch (e) {}
    };

    conn.ev.on('messages.upsert', menuListener);

    setTimeout(() => {
        conn.ev.off('messages.upsert', menuListener);
    }, 5 * 60 * 1000);

} catch (e) {
    console.log(e);
    reply(`Error: ${e}`);
}

    }
};
