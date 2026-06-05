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

    // ════════════════════════════════════════
    // STATUS 0 — Settings Commands
    // ════════════════════════════════════════
    let status0 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     ⚙️ *SETTINGS COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

*🟢 ʏᴏᴜ ɴᴇᴇᴅ ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ*

1. ɢᴏ ᴛᴏ ᴡᴇʙ ꜱɪᴛᴇ >> nimeshmihiranga.github.io/mezukasite//settings
2. ᴇɴᴛᴇʀ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ ᴀɴᴅ ᴘᴀꜱꜱᴡᴏʀᴅ
3. ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ
4. ꜱᴀᴠᴇ ꜱᴇᴛᴛɪɴɢꜱ
━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     ⚙️ *SETTINGS COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

*🟢 ʏᴏᴜ ɴᴇᴇᴅ ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ*

1. ɢᴏ ᴛᴏ ᴡᴇʙ ꜱɪᴛᴇ >> nimeshmihiranga.github.io/mezukasite/
2. ᴇɴᴛᴇʀ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ ᴀɴᴅ ᴘᴀꜱꜱᴡᴏʀᴅ
3. ᴇᴅɪᴛ ꜱᴇᴛᴛɪɴɢꜱ
4. ꜱᴀᴠᴇ ꜱᴇᴛᴛɪɴɢꜱ
━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 1 — Main Commands
    // ════════════════════════════════════════
    let status1 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     ✨ *MAIN COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🤖 ${prefix}alive
➤ උදා: \`${prefix}alive\`
💚 බොට් ක්‍රියාකාරීද යන්න පරීක්ෂා කිරීමට ✅

🏓 ${prefix}ping
➤ උදා: \`${prefix}ping\`
⚡ බොට්ගේ ප්‍රතිචාර වේලාව දැනගැනීමට ✅

📋 ${prefix}menu
➤ උදා: \`${prefix}menu\`
🌸 සම්පූර්ණ මෙනු ලිස්ට් ලබාගැනීමට ✅

👁️ ${prefix}vv
➤ උදා: \`${prefix}vv\`
🔓 View Once Messages ඇරලා දකිනීමට ✅

💾 ${prefix}save
➤ උදා: \`${prefix}save\`
📥 Status සේව් කිරීමට ✅

🆔 ${prefix}jid
➤ උදා: \`${prefix}jid\`
🔢 Chat JID ලබාගැනීමට ✅

🖼️ ${prefix}getpp
➤ උදා: \`${prefix}getpp\`
📸 Profile Picture ලබාගැනීමට ✅

🎨 ${prefix}setpp
➤ උදා: \`${prefix}setpp\`
🤖 බොට්ගේ DP වෙනස් කිරීමට ✅

🔗 ${prefix}derect
➤ උදා: \`${prefix}derect\`
📤 URL Direct ලෙස Send කිරීමට ✅

🔑 ${prefix}pair
➤ උදා: \`${prefix}pair\`
📱 Pair Code ලබාගැනීමට ✅

👑 ${prefix}owner
➤ උදා: \`${prefix}owner\`
💌 Owner Info ලබාගැනීමට ✅

✂️ ${prefix}rmbg
➤ උදා: \`${prefix}rmbg\`
🖼️ Image Background Remove කිරීමට ✅

📄 ${prefix}passpaper
➤ උදා: \`${prefix}passpaper\`
🎓 Past Papers ලබාගැනීමට ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     ✨ *MAIN COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🤖 ${prefix}alive
➤ Ex: \`${prefix}alive\`
💚 Check if the bot is active ✅

🏓 ${prefix}ping
➤ Ex: \`${prefix}ping\`
⚡ Check the bot response time ✅

📋 ${prefix}menu
➤ Ex: \`${prefix}menu\`
🌸 Get the full command menu ✅

👁️ ${prefix}vv
➤ Ex: \`${prefix}vv\`
🔓 View once messages ✅

💾 ${prefix}save
➤ Ex: \`${prefix}save\`
📥 Save status media ✅

🆔 ${prefix}jid
➤ Ex: \`${prefix}jid\`
🔢 Get chat JID ✅

🖼️ ${prefix}getpp
➤ Ex: \`${prefix}getpp\`
📸 Get profile picture ✅

🎨 ${prefix}setpp
➤ Ex: \`${prefix}setpp\`
🤖 Change bot display picture ✅

🔗 ${prefix}derect
➤ Ex: \`${prefix}derect\`
📤 Send URL directly ✅

🔑 ${prefix}pair
➤ Ex: \`${prefix}pair\`
📱 Get pair code ✅

👑 ${prefix}owner
➤ Ex: \`${prefix}owner\`
💌 Get owner info ✅

✂️ ${prefix}rmbg
➤ Ex: \`${prefix}rmbg\`
🖼️ Remove image background ✅

📄 ${prefix}passpaper
➤ Ex: \`${prefix}passpaper\`
🎓 Get past papers ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 2 — Download Commands
    // ════════════════════════════════════════
    let status2 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     📥 *DOWNLOAD COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🎵 ${prefix}song / ${prefix}play / ${prefix}music / ${prefix}s
➤ උදා: \`${prefix}song Chillout\`
🎧 YouTube MP3 ලෙස ගීතය බාගන්නට ✅

🎬 ${prefix}video / ${prefix}vid / ${prefix}v
➤ උදා: \`${prefix}video link\`
📹 YouTube Video බාගන්නට ✅

🎬 ${prefix}animedl
➤ උදා: \`${prefix}animedl naruto\`
📹 Anime බාගන්නට ✅

🎵 ${prefix}tiktok
➤ උදා: \`${prefix}tiktok [link]\`
🎶 TikTok Video බාගන්නට ✅

📘 ${prefix}fb
➤උදා: \`${prefix}fb [link]\`
📥 Facebook Video බාගන්නට ✅

☁️ ${prefix}gdrive
➤උදා: \`${prefix}gdrive [link]\`
📂 Google Drive File බාගන්නට ✅

🔞 ${prefix}xdl
➤උදා: \`${prefix}xdl [link]\`
🚫 Adult Video බාගන්නට ✅

📱 ${prefix}apk
➤උදා: \`${prefix}apk WhatsApp\`
🤖 Android APK බාගන්නට ✅

📸 ${prefix}ig
➤උදා: \`${prefix}ig [link]\`
🌐 Instagram Video බාගන්නට ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     📥 *DOWNLOAD COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🎵 ${prefix}song / ${prefix}play / ${prefix}music / ${prefix}s
➤ Ex: \`${prefix}song Chillout\`
🎧 Download YouTube audio as MP3 ✅

🎬 ${prefix}video / ${prefix}vid / ${prefix}v
➤ Ex: \`${prefix}video Funny Clip\`
📹 Download YouTube video ✅

🎬 ${prefix}animedl
➤ Ex: \`${prefix}animedl naruto\`
📹 Download anime ✅

🎵 ${prefix}tiktok
➤ Ex: \`${prefix}tiktok [link]\`
🎶 Download TikTok video ✅

📘 ${prefix}fb
➤ Ex: \`${prefix}fb [link]\`
📥 Download Facebook video ✅

☁️ ${prefix}gdrive
➤ Ex: \`${prefix}gdrive [link]\`
📂 Download Google Drive file ✅

🔞 ${prefix}xdl
➤ Ex: \`${prefix}xdl [link]\`
🚫 Download adult video ✅

📱 ${prefix}apk
➤ Ex: \`${prefix}apk WhatsApp\`
🤖 Download Android APK ✅

📸 ${prefix}ig
➤ Ex: \`${prefix}ig [link]\`
🌐 Download Instagram video ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 3 — Convert Commands
    // ════════════════════════════════════════
    let status3 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🔄 *CONVERT COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🖼️ ${prefix}sticker
➤උදා: \`${prefix}sticker\` (image reply)
🎨 Image එකක් Sticker එකක් කිරීමට ✅

⭕ ${prefix}rsticker
➤උදා: \`${prefix}rsticker\` (image reply)
🔵 Round Sticker එකක් සාදනවා ✅

📷 ${prefix}toimg
➤උදා: \`${prefix}toimg\` (sticker reply)
🖼️ Sticker එකක් Image කිරීමට ✅

🎵 ${prefix}tomp3
➤උදා: \`${prefix}tomp3\` (video reply)
🎧 Video එකක් MP3 කිරීමට ✅

🔗 ${prefix}tourl
➤උදා: \`${prefix}tourl\` (image reply)
🌐 Image එකක් ImgBB URL කිරීමට ✅

📎 ${prefix}url
➤උදා: \`${prefix}url\` (media reply)
🔗 Media එකක් Catbox URL කිරීමට ✅

🗣️ ${prefix}tts
➤උදා: \`${prefix}tts ආයුබෝවන්\`
🔊 Text ශබ්දයට හරවනවා ✅

✍️ ${prefix}ttp
➤උදා: \`${prefix}ttp Hello\`
🎨 Text Sticker එකක් සාදනවා ✅

✨ ${prefix}attp
➤උදා: \`${prefix}attp Hello\`
💫 Animated Text Sticker සාදනවා ✅

🎨 ${prefix}fancy
➤උදා: \`${prefix}fancy Hello\`
✒️ Fancy Text ලෙස හරවනවා ✅

🔀 ${prefix}emojimix
➤උදා: \`${prefix}emojimix 😂+😍\`
🎭 Emoji දෙකක් Mix කිරීමට ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🔄 *CONVERT COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🖼️ ${prefix}sticker
➤ Ex: \`${prefix}sticker\` (reply to image)
🎨 Convert image to sticker ✅

⭕ ${prefix}rsticker
➤ Ex: \`${prefix}rsticker\` (reply to image)
🔵 Create a round sticker ✅

📷 ${prefix}toimg
➤ Ex: \`${prefix}toimg\` (reply to sticker)
🖼️ Convert sticker to image ✅

🎵 ${prefix}tomp3
➤ Ex: \`${prefix}tomp3\` (reply to video)
🎧 Convert video to MP3 ✅

🔗 ${prefix}tourl
➤ Ex: \`${prefix}tourl\` (reply to image)
🌐 Upload image to ImgBB URL ✅

📎 ${prefix}url
➤ Ex: \`${prefix}url\` (reply to media)
🔗 Upload media to Catbox URL ✅

🗣️ ${prefix}tts
➤ Ex: \`${prefix}tts Hello World\`
🔊 Convert text to speech ✅

✍️ ${prefix}ttp
➤ Ex: \`${prefix}ttp Hello\`
🎨 Create a text sticker ✅

✨ ${prefix}attp
➤ Ex: \`${prefix}attp Hello\`
💫 Create an animated text sticker ✅

🎨 ${prefix}fancy
➤ Ex: \`${prefix}fancy Hello\`
✒️ Convert text to fancy style ✅

🔀 ${prefix}emojimix
➤ Ex: \`${prefix}emojimix 😂+😍\`
🎭 Mix two emojis together ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 4 — Owner Commands
    // ════════════════════════════════════════
    let status4 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     👑 *OWNER COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🔄 ${prefix}restart1
➤උදා: \`${prefix}restart1\`
⚙️ බොට් Restart කිරීමට ✅

🎨 ${prefix}setpp
➤උදා: \`${prefix}setpp\` (image reply)
🤖 බොට්ගේ DP වෙනස් කිරීමට ✅

🔑 ${prefix}pair
➤උදා: \`${prefix}pair 94xxxxxxxx\`
📱 Pair Code ලබාගැනීමට ✅

👑 ${prefix}owner
➤උදා: \`${prefix}owner\`
💌 Owner Info ලබාගැනීමට ✅

📸 ${prefix}ss
➤උදා: \`${prefix}ss [url]\`
🌐 Website Screenshot ගැනීමට ✅

🔍 ${prefix}google
➤උදා: \`${prefix}google Sri Lanka\`
🌐 Google Search කිරීමට ✅

🖼️ ${prefix}img
➤උදා: \`${prefix}img Sunset\`
📷 Image Search කිරීමට ✅

🎌 ${prefix}anime
➤උදා: \`${prefix}anime Naruto\`
📥 Anime Download කිරීමට ✅

📤 ${prefix}send
➤උදා: \`${prefix}send\` (status reply)
💾 Status Download කිරීමට ✅

👥 ${prefix}gmdp
➤උදා: \`${prefix}gmdp\`
🖼️ සියලු Group DP ලබාගැනීමට ✅

☁️ ${prefix}megaup
➤උදා: \`${prefix}megaup\` (file reply)
📤 Mega Upload කිරීමට ✅

📢 ${prefix}cinfo
➤උදා: \`${prefix}cinfo\`
ℹ️ Channel Info ලබාගැනීමට ✅

🆔 ${prefix}cid
➤උදා: \`${prefix}cid\`
🔢 Channel ID ලබාගැනීමට ✅

💬 ${prefix}creact
➤උදා: \`${prefix}creact\`
📢 Channel React කිරීමට ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     👑 *OWNER COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🔄 ${prefix}restart1
➤ Ex: \`${prefix}restart1\`
⚙️ Restart the bot ✅

🎨 ${prefix}setpp
➤ Ex: \`${prefix}setpp\` (reply to image)
🤖 Change bot display picture ✅

🔑 ${prefix}pair
➤ Ex: \`${prefix}pair 94xxxxxxxx\`
📱 Get pair code ✅

👑 ${prefix}owner
➤ Ex: \`${prefix}owner\`
💌 Get owner info ✅

📸 ${prefix}ss
➤ Ex: \`${prefix}ss [url]\`
🌐 Take a website screenshot ✅

🔍 ${prefix}google
➤ Ex: \`${prefix}google Sri Lanka\`
🌐 Search on Google ✅

🖼️ ${prefix}img
➤ Ex: \`${prefix}img Sunset\`
📷 Search for images ✅

🎌 ${prefix}anime
➤ Ex: \`${prefix}anime Naruto\`
📥 Download anime ✅

📤 ${prefix}send
➤ Ex: \`${prefix}send\` (reply to status)
💾 Download status media ✅

👥 ${prefix}gmdp
➤ Ex: \`${prefix}gmdp\`
🖼️ Get all group display pictures ✅

☁️ ${prefix}megaup
➤ Ex: \`${prefix}megaup\` (reply to file)
📤 Upload to Mega ✅

📢 ${prefix}cinfo
➤ Ex: \`${prefix}cinfo\`
ℹ️ Get channel info ✅

🆔 ${prefix}cid
➤ Ex: \`${prefix}cid\`
🔢 Get channel ID ✅

💬 ${prefix}creact
➤ Ex: \`${prefix}creact\`
📢 React on channel ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 5 — School & Special Commands
    // ════════════════════════════════════════
    let status5 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🎓 *SCHOOL & SPECIAL COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

📄 ${prefix}passpaper
➤උදා: \`${prefix}passpaper\`
🎓 Past Papers ලබාගැනීමට ✅

🌐 ${prefix}trt
➤උදා: \`${prefix}trt si Hello\`
🔤 Text Translate කිරීමට ✅

🗣️ ${prefix}tts
➤උදා: \`${prefix}tts ආයුබෝවන්\`
🔊 Text ශබ්දයට හරවනවා ✅

🔍 ${prefix}google
➤උදා: \`${prefix}google AI කියන්නේ?\`
🌐 Google Search කිරීමට ✅

🖼️ ${prefix}img
➤උදා: \`${prefix}img Sri Lanka Map\`
📷 Image Search කිරීමට ✅

🎌 ${prefix}anime
➤උදා: \`${prefix}anime One Piece\`
📥 Anime Download කිරීමට ✅

✂️ ${prefix}rmbg
➤උදා: \`${prefix}rmbg\` (image reply)
🖼️ Image Background Remove කිරීමට ✅

🎨 ${prefix}fancy
➤උදා: \`${prefix}fancy MEZUKA\`
✒️ Fancy Text ලෙස හරවනවා ✅

🔀 ${prefix}emojimix
➤උදා: \`${prefix}emojimix 😂+😍\`
🎭 Emoji දෙකක් Mix කිරීමට ✅

✍️ ${prefix}ttp
➤උදා: \`${prefix}ttp MEZUKA\`
🎨 Text Sticker එකක් සාදනවා ✅

✨ ${prefix}attp
➤උදා: \`${prefix}attp MEZUKA\`
💫 Animated Text Sticker සාදනවා ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🎓 *SCHOOL & SPECIAL COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

📄 ${prefix}passpaper
➤ Ex: \`${prefix}passpaper\`
🎓 Get past papers ✅

🌐 ${prefix}trt
➤ Ex: \`${prefix}trt si Hello\`
🔤 Translate text ✅

🗣️ ${prefix}tts
➤ Ex: \`${prefix}tts Hello World\`
🔊 Convert text to speech ✅

🔍 ${prefix}google
➤ Ex: \`${prefix}google What is AI\`
🌐 Search on Google ✅

🖼️ ${prefix}img
➤ Ex: \`${prefix}img Sri Lanka Map\`
📷 Search for images ✅

🎌 ${prefix}anime
➤ Ex: \`${prefix}anime One Piece\`
📥 Download anime ✅

✂️ ${prefix}rmbg
➤ Ex: \`${prefix}rmbg\` (reply to image)
🖼️ Remove image background ✅

🎨 ${prefix}fancy
➤ Ex: \`${prefix}fancy MEZUKA\`
✒️ Convert text to fancy style ✅

🔀 ${prefix}emojimix
➤ Ex: \`${prefix}emojimix 😂+😍\`
🎭 Mix two emojis together ✅

✍️ ${prefix}ttp
➤ Ex: \`${prefix}ttp MEZUKA\`
🎨 Create a text sticker ✅

✨ ${prefix}attp
➤ Ex: \`${prefix}attp MEZUKA\`
💫 Create an animated text sticker ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // STATUS 6 — Team Admin Commands
    // ════════════════════════════════════════
    let status6 = isSI ? `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🛡️ *TEAM ADMIN COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🚫 ${prefix}kick
➤උදා: \`${prefix}kick\` (reply/tag)
👢 Member කෙනෙකු Group එකෙන් Kick කිරීමට ✅

➕ ${prefix}add
➤උදා: \`${prefix}add 94xxxxxxxx\`
👤 Member කෙනෙකු Group එකට Add කිරීමට ✅

👑 ${prefix}promote
➤උදා: \`${prefix}promote\` (reply/tag)
⬆️ Member කෙනෙකු Admin කිරීමට ✅

👤 ${prefix}demote
➤උදා: \`${prefix}demote\` (reply/tag)
⬇️ Admin කෙනෙකු Normal Member කිරීමට ✅

🔇 ${prefix}mute
➤උදා: \`${prefix}mute\`
🔕 Group එක Mute (Only Admin) කිරීමට ✅

🔊 ${prefix}unmute
➤උදා: \`${prefix}unmute\`
📢 Group එක Unmute කිරීමට ✅

✏️ ${prefix}gname
➤උදා: \`${prefix}gname New Name\`
📝 Group නම වෙනස් කිරීමට ✅

📝 ${prefix}gdesc
➤උදා: \`${prefix}gdesc New Desc\`
📋 Group Description වෙනස් කිරීමට ✅

🔗 ${prefix}glink
➤උදා: \`${prefix}glink\`
📎 Group Invite Link ලබාගැනීමට ✅

🔄 ${prefix}resetlink
➤උදා: \`${prefix}resetlink\`
♻️ Group Invite Link Reset කිරීමට ✅

ℹ️ ${prefix}ginfo
➤උදා: \`${prefix}ginfo\`
📊 Group Info ලබාගැනීමට ✅

👥 ${prefix}members
➤උදා: \`${prefix}members\`
📋 Group Members List ලබාගැනීමට ✅

📢 ${prefix}tagall
➤උදා: \`${prefix}tagall\`
🔔 සියලු Members Tag කිරීමට ✅

👑 ${prefix}tagadmin
➤උදා: \`${prefix}tagadmin\`
🔔 සියලු Admins Tag කිරීමට ✅

🗑️ ${prefix}delete / ${prefix}del
➤උදා: \`${prefix}del\` (reply)
❌ Message Delete කිරීමට ✅

📣 ${prefix}announce
➤උදා: \`${prefix}announce\`
📡 Group Announce Mode Toggle කිරීමට ✅

📊 ${prefix}gstatus
➤උදා: \`${prefix}gstatus\`
📈 Group Status ලබාගැනීමට ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
    : `🌹⃝⃘̉̉̉̉̉̉🧚━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚♡ ⋆｡ ❀
┊ ☪︎⋆
⊹     🛡️ *TEAM ADMIN COMMANDS*
┊ . 
✧
╭─ 「 *\`${BOT_NAME}\`* 」
╰──────────────❂ 


🌸────────────🌸

🚫 ${prefix}kick
➤ Ex: \`${prefix}kick\` (reply/tag)
👢 Kick a member from the group ✅

➕ ${prefix}add
➤ Ex: \`${prefix}add 94xxxxxxxx\`
👤 Add a member to the group ✅

👑 ${prefix}promote
➤ Ex: \`${prefix}promote\` (reply/tag)
⬆️ Promote a member to admin ✅

👤 ${prefix}demote
➤ Ex: \`${prefix}demote\` (reply/tag)
⬇️ Demote an admin to member ✅

🔇 ${prefix}mute
➤ Ex: \`${prefix}mute\`
🔕 Mute the group (admin only mode) ✅

🔊 ${prefix}unmute
➤ Ex: \`${prefix}unmute\`
📢 Unmute the group ✅

✏️ ${prefix}gname
➤ Ex: \`${prefix}gname New Name\`
📝 Change the group name ✅

📝 ${prefix}gdesc
➤ Ex: \`${prefix}gdesc New Desc\`
📋 Change the group description ✅

🔗 ${prefix}glink
➤ Ex: \`${prefix}glink\`
📎 Get the group invite link ✅

🔄 ${prefix}resetlink
➤ Ex: \`${prefix}resetlink\`
♻️ Reset the group invite link ✅

ℹ️ ${prefix}ginfo
➤ Ex: \`${prefix}ginfo\`
📊 Get group info ✅

👥 ${prefix}members
➤ Ex: \`${prefix}members\`
📋 Get group members list ✅

📢 ${prefix}tagall
➤ Ex: \`${prefix}tagall\`
🔔 Tag all members ✅

👑 ${prefix}tagadmin
➤ Ex: \`${prefix}tagadmin\`
🔔 Tag all admins ✅

🗑️ ${prefix}delete / ${prefix}del
➤ Ex: \`${prefix}del\` (reply to message)
❌ Delete a message ✅

📣 ${prefix}announce
➤ Ex: \`${prefix}announce\`
📡 Toggle group announce mode ✅

📊 ${prefix}gstatus
➤ Ex: \`${prefix}gstatus\`
📈 Get group status ✅

━━━━━━━━━━━━━━━━━━━━━━━
> *🔖© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

    // ════════════════════════════════════════
    // MAIN MENU STATUS
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

    let status = isSI ? `
🌹⃝⃘̉̉̉̉̉̉🧚 *${BOT_NAME}*
━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊ ⋆｡ ❀⋆｡ ☪︎⋆
┊ ┊ ✫ ˚♡ ⋆｡ ✧
┊ ☪︎⋆ ${getGreeting()}
┊ *${timeString}*
✧

🌝 ලස්සන දවසක් ගෙවෙනා ⍢
꒰ ˘͈ᵕ˘͈ ꒱ *සෙන්පායි* ඔබව සාදරයෙන් පිළිගනිමු~

╭─「 🎀 *ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ* 」
│ ⏰ » *Uptime:* ${runtime(process.uptime())}
│ 💾 » *Used:* ${usedRAM} MB
│ 💽 » *Total:* ${totalRAM} MB
│ 👑 » ᴛᴇᴀᴍ ʙʟᴀᴄᴋ ᴄᴀᴛꜱ
│ 🌐 » nimeshmihiranga.github.io/mezukasite/
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
🦋 *අංකයෙන් Reply කරන්න!* 🌸
꒰ ˘͈ᵕ˘͈ ꒱ ᴍᴇᴢᴜᴋᴀ ʟᴏᴠᴇꜱ ʏᴏᴜ 💕
*┌───────────────┐*
*│© ${BOT_NAME} ʙʏ ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*
*└───────────────┘*`
    : `
🌹⃝⃘̉̉̉̉̉̉🧚 *${BOT_NAME}*
━━━━◆◆◆◆◆
┊ ┊ ┊ ┊ ┊ ⋆｡ ❀⋆｡ ☪︎⋆
┊ ┊ ✫ ˚♡ ⋆｡ ✧
┊ ☪︎⋆ ${getGreeting()}
┊ *${timeString}*
✧

🌝 ʜᴀᴠᴇ ᴀ ɴɪᴄᴇ ᴅᴀʏ ⍢
꒰ ˘͈ᵕ˘͈ ꒱ *ꜱᴇɴᴘᴀɪ* ʟᴀ ᴡᴇʟᴄᴏᴍᴇ~

╭─「 🎀 *ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ* 」
│ ⏰ » *Uptime:* ${runtime(process.uptime())}
│ 💾 » *Used:* ${usedRAM} MB
│ 💽 » *Total:* ${totalRAM} MB
│ 👑 » ᴛᴇᴀᴍ ʙʟᴀᴄᴋ ᴄᴀᴛꜱ
│ 🌐 » nimeshmihiranga.github.io/mezukasite/
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
🦋 *ɴᴜᴍʙᴇʀ ʀᴇᴘʟʏ ᴋᴀʀᴀɴɴ!* 🌸
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
        audio: { url: 'https://github.com/NimeshMihiranga-Neno/Mezuka-help/raw/main/ReelAudio-44348.mp3' },
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
