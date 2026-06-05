// ============================================================
// COMMAND: gf
// MEZUKA MD V5 - command/gf.js
// ============================================================

module.exports = {
    name: "gf",
    aliases: ["sakura", "girlfriend"],
    async execute({ conn, mek, m, from, sender, isOwner, isGroup, reply, quoted, q, args, body, pushname, botNumber, ownerNumber, readEnvSync, adhiqmini, GQCAP, prefix, runtime, os }) {

    // ── Memory Setup ──────────────────────────────────────────
    if (!global.gfMemory) global.gfMemory = new Map();
    if (!global.gfMemoryClearInterval) {
        global.gfMemoryClearInterval = setInterval(() => {
            global.gfMemory.clear();
            console.log('[GF] Memory auto cleared ✅');
        }, 20 * 60 * 1000);
    }

    // ── React Helper ──────────────────────────────────────────
    const react = async (emoji) => {
        try {
            await conn.sendMessage(from, {
                react: { text: emoji, key: mek.key }
            });
        } catch (err) {
            console.log('React Error:', err.message);
        }
    };

    const axios = require('axios');

    // ── AI APIs ───────────────────────────────────────────────
    const AI_APIS = [
        (text) => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(text),
        (text) => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(text),
        (text) => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(text),
    ];

    const GF_NAME = 'Sakura';
    const MAX_MEM = 20;
    const HEADER  = `★彡 𝓜𝓮𝔃𝓾𝓴𝓪 𝓜𝓓🧃🌸 彡★`;

    // ── Memory Functions ──────────────────────────────────────
    const getMemory = (userId) => {
        if (!global.gfMemory.has(userId)) global.gfMemory.set(userId, []);
        return global.gfMemory.get(userId);
    };

    const addMemory = (userId, role, text) => {
        const hist = getMemory(userId);
        hist.push({ role, text });
        if (hist.length > MAX_MEM) hist.splice(0, hist.length - MAX_MEM);
    };

    // ── Build Prompt ──────────────────────────────────────────
    const buildPrompt = (userId, userMsg) => {
        const hist = getMemory(userId);
        const historyText = hist.length > 0
            ? hist.map(h => `${h.role === 'user' ? 'User' : GF_NAME}: ${h.text}`).join('\n')
            : '';
        return (
            `You are ${GF_NAME}, a sweet, caring and playful virtual girlfriend chatbot. ` +
            `You respond warmly, with love and cute emojis. Keep replies short (2-4 sentences). ` +
            `Never break character.\n\n` +
            (historyText ? `Conversation so far:\n${historyText}\n\n` : '') +
            `User: ${userMsg}\n${GF_NAME}:`
        );
    };

    // ── Ask AI ────────────────────────────────────────────────
    const askAI = async (prompt) => {
        for (const buildUrl of AI_APIS) {
            try {
                const { data } = await axios.get(buildUrl(prompt), { timeout: 15000 });
                const res = data?.data?.response;
                if (res && typeof res === 'string' && res.trim()) return res.trim();
            } catch {
                continue;
            }
        }
        throw new Error('All AI APIs failed');
    };

    // ── Main Logic ────────────────────────────────────────────
    try {
        const userMsg = q?.trim();
        const userId = sender;

        // No message
        if (!userMsg) {
            await react('💕');
            return reply(`${HEADER}

💕 *${GF_NAME} - Virtual Girlfriend*

Hey there! Talk to me~ 🌸

📌 *Usage:* ${prefix}gf <message>
📌 *Example:* ${prefix}gf good morning

💡 *Tip:* ${prefix}gf reset — to clear memory 🧹`);
        }

        // Reset memory
        if (userMsg === 'reset' || userMsg === 'forget') {
            global.gfMemory.delete(userId);
            await react('🧹');
            return reply(`${HEADER}

🌸 *${GF_NAME}*

Okay~ I forgot everything 🥺
Let's start fresh! 💕`);
        }

        await react('💕');

        const prompt = buildPrompt(userId, userMsg);
        const aiReply = await askAI(prompt);

        addMemory(userId, 'user', userMsg);
        addMemory(userId, 'gf', aiReply);

        await conn.sendMessage(from, {
            text: `${HEADER}\n\n🌸 *${GF_NAME}*\n\n${aiReply}`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424190766692@newsletter',
                    newsletterName: "Mezuka MD V5✻",
                    serverMessageId: 999,
                }
            }
        }, { quoted: mek });

        await react('✅');

    } catch (e) {
        await react('❌');
        reply(`${HEADER}

😢 *${GF_NAME}*

Sorry baby, I'm not feeling well right now.
Try again later~ 💔`);
        console.log('GF Error:', e);
    }

    }
};
