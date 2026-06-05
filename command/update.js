const { exec }  = require('child_process');
const fs        = require('fs');
const path      = require('path');
const util      = require('util');
const execAsync = util.promisify(exec);

const ALLOWED_NUMBER  = '94721584279';
const GITHUB_TOKEN    = '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';
const GITHUB_REPO     = 'https://github.com/NimeshMihiranga/update.git';
const REPO_BRANCH     = 'main';
const COMMAND_DIR     = __dirname;
const TEMP_CLONE_DIR  = path.join(__dirname, '..', 'temp', '_update_clone');
const LOADER_PATH     = path.join(__dirname, '..', 'commandLoader.js');
const MAIN_PATH       = path.join(__dirname, '..', 'main.js');

// Token inject කළ authenticated URL එක build කරනවා
function getAuthRepoUrl() {
    const url = new URL(GITHUB_REPO);
    url.username = GITHUB_TOKEN;
    url.password = 'x-oauth-basic';
    return url.toString();
}

async function msg(conn, from, text, quotedMsg) {
    return conn.sendMessage(from, { text }, { quoted: quotedMsg });
}

module.exports = {
    name: 'update',
    aliases: [],

    async execute({ conn, mek, m, from, sender, reply, ownerNumber, adhiqmini }) {

        const senderNumber = sender.replace('@s.whatsapp.net', '').split(':')[0];
        if (senderNumber !== ALLOWED_NUMBER) {
            return reply(`╭━━━〔 🌹⃝⃘ 𝑴𝑬𝒁𝑼𝑲𝑨 𝑴𝑫 𝑽5 🧚 〕━━━╮
┃ ❌ ඔබට මෙම command භාවිතා කළ නොහැක
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`);
        }

        await m.react('⏳');

        // Token expose නොවෙන්න GITHUB_REPO පෙන්නනවා (auth URL නෙමෙයි)
        await msg(conn, from, `╭━━━〔 🔄 *MEZUKA UPDATE* 〕━━━╮
┃
┃ 📦 GitHub ෙකන් command/ folder
┃    download කිරීම ආරම්භ විය...
┃
┃ 🌐 repo  : NimeshMihiranga/update (🔒 private)
┃ 🌿 branch: ${REPO_BRANCH}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`, adhiqmini);

        const AUTH_REPO_URL = getAuthRepoUrl(); // token-embedded URL

        try {

            // Step 1: Clean temp dir
            if (fs.existsSync(TEMP_CLONE_DIR)) {
                await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`);
            }
            fs.mkdirSync(TEMP_CLONE_DIR, { recursive: true });

            // Step 2: Clone only command/ folder from GitHub
            await msg(conn, from, `🌐 *Step 1/4* — Cloning command/ from GitHub...`, mek);

            try {
                await execAsync(
                    `git clone --depth=1 --filter=blob:none --sparse -b ${REPO_BRANCH} "${AUTH_REPO_URL}" "${TEMP_CLONE_DIR}"`,
                    { timeout: 60000 }
                );
                await execAsync(`cd "${TEMP_CLONE_DIR}" && git sparse-checkout set command`, { timeout: 30000 });
                await execAsync(`cd "${TEMP_CLONE_DIR}" && git checkout`, { timeout: 30000 });
            } catch (gitErr) {
                // Fallback: full shallow clone
                await msg(conn, from, `⚠️ Sparse clone failed. Full clone try...`, mek);
                await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`);
                fs.mkdirSync(TEMP_CLONE_DIR, { recursive: true });
                await execAsync(
                    `git clone --depth=1 -b ${REPO_BRANCH} "${AUTH_REPO_URL}" "${TEMP_CLONE_DIR}"`,
                    { timeout: 120000 }
                );
            }

            const clonedCommandDir = path.join(TEMP_CLONE_DIR, 'command');
            if (!fs.existsSync(clonedCommandDir)) {
                await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`).catch(() => {});
                // Error message ෙකේ token නෑ — public URL පෙන්නනවා
                return reply(`❌ Repo ෙකේ command/ folder හමු නොවිණි!\n🔗 ${GITHUB_REPO}`);
            }

            const newFiles = fs.readdirSync(clonedCommandDir).filter(f => f.endsWith('.js'));
            if (newFiles.length === 0) {
                await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`).catch(() => {});
                return reply(`❌ command/ folder ෙකේ .js files නෑ!`);
            }

            // Step 3: Replace command files
            await msg(conn, from, `📂 *Step 2/4* — Replacing command files...
🗑️ Old: ${fs.readdirSync(COMMAND_DIR).filter(f => f.endsWith('.js') && f !== 'update.js').length} files
📥 New: ${newFiles.length} files`, mek);

            const oldFiles = fs.readdirSync(COMMAND_DIR).filter(f => f.endsWith('.js') && f !== 'update.js');
            for (const file of oldFiles) {
                try { fs.unlinkSync(path.join(COMMAND_DIR, file)); } catch {}
            }

            for (const file of newFiles) {
                fs.copyFileSync(
                    path.join(clonedCommandDir, file),
                    path.join(COMMAND_DIR, file)
                );
            }

            await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`).catch(() => {});

            // Step 4: Hot-reload
            await msg(conn, from, `🔃 *Step 3/4* — Reloading commands in memory...`, mek);

            const { reload } = require(LOADER_PATH);
            const loadedCount = reload();

            // Step 5: Reconnect
            await msg(conn, from, `🔌 *Step 4/4* — Bot session reconnect කිරීම...`, mek);

            await new Promise(r => setTimeout(r, 2000));

            const sessionFolder = path.join(__dirname, '..', 'auth_info_baileys', ownerNumber);

            try { conn.ev.removeAllListeners(); } catch {}
            try { conn.end(); } catch {}
            if (global.WA_SESSIONS) global.WA_SESSIONS.delete(ownerNumber);

            await new Promise(r => setTimeout(r, 1500));

            const { connectToWA } = require(MAIN_PATH);
            connectToWA(ownerNumber, sessionFolder);

            await msg(conn, from, `╭━━━〔 ✅ *UPDATE COMPLETE* 〕━━━╮
┃
┃ 📥 Files downloaded : ${newFiles.length}
┃ 🔃 Commands loaded  : ${loadedCount}
┃ 🔌 Session reconnecting...
┃
┃ 🌿 Latest commands installed ✅
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`, adhiqmini);

            await m.react('✅');

        } catch (err) {
            console.error('❌ Update command error:', err);
            await execAsync(`rm -rf "${TEMP_CLONE_DIR}"`).catch(() => {});
            await m.react('❌');

            // Error message ෙකේ token strip කරනවා
            const safeError = (err.message || '').replace(GITHUB_TOKEN, '***TOKEN***').slice(0, 250);

            await msg(conn, from, `╭━━━〔 ❌ *UPDATE FAILED* 〕━━━╮
┃
┃ Error: ${safeError}
┃
┃ 🔧 Manual:
┃ git clone ${GITHUB_REPO}
┃ cp -r update/command ./
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`, mek);
        }
    }
};