// ============================================================
// COMMAND: v2ray
// MEZUKA MD V5 - command/v2ray.js
// API: https://murmuring-savannah-21272-593b593ca6ea.herokuapp.com
// ============================================================

module.exports = {
    name: "v2ray",
    aliases: ["vpn", "vless"],
    async execute({ conn, mek, m, from, sender, reply, adhiqmini, prefix }) {

        const axios = require('axios');

        const API = 'https://murmuring-savannah-21272-593b593ca6ea.herokuapp.com';

        const LOC_LABELS = {
            sg_a: '🇸🇬 Singapore A',
            sg_b: '🇸🇬 Singapore B'
        };

        // ── waitForReply helper ──────────────────────────────────
        const waitForReply = (targetMsgId, validOptions, timeoutMs = 60000) => {
            return new Promise((resolve) => {
                const timer = setTimeout(() => {
                    conn.ev.off('messages.upsert', listener);
                    resolve(null);
                }, timeoutMs);

                const listener = ({ messages }) => {
                    for (const msg of messages) {
                        const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === targetMsgId;
                        const text = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
                        const isSame = msg.key.remoteJid === from;
                        if (isReply && isSame && validOptions.includes(text)) {
                            clearTimeout(timer);
                            conn.ev.off('messages.upsert', listener);
                            resolve({ text, msg });
                        }
                    }
                };
                conn.ev.on('messages.upsert', listener);
            });
        };

        const nlCtx = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424190766692@newsletter',
                newsletterName: "Mezuka MD V5✻",
                serverMessageId: 999,
            }
        };

        try {
            await m.react('🔍');

            // ════════════════════════════════════════════════════
            // STEP 1: Fetch & show locations
            // ════════════════════════════════════════════════════
            const locRes = await axios.get(`${API}/api/v2raylocation`, { timeout: 10000 });
            const locations = locRes.data?.locations || [];

            if (!locations.length) {
                return reply(`꒰ᵎ ❌ *V2Ray* ᵎ꒱\n\n⚠️ No locations available!\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`);
            }

            let locMsg = `꒰ᵎ 🌐 *V2Ray Locations* ᵎ꒱\n\n`;
            locMsg += `✨ *Available Server Locations:*\n\n`;
            locations.forEach((loc, i) => {
                locMsg += `　*${i + 1}.* ${LOC_LABELS[loc.id] || loc.id}\n`;
                locMsg += `　　📡 Instances: ${loc.instances}  •  Status: 🟢 Online\n\n`;
            });
            locMsg += `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n> 💬 *Reply 1-${locations.length} to select*`;

            const locMsgSent = await conn.sendMessage(from, {
                text: locMsg,
                contextInfo: nlCtx
            }, { quoted: adhiqmini });

            await m.react('✅');

            // ── Wait for location selection ──────────────────────
            const validLocs = locations.map((_, i) => String(i + 1));
            const locPicked = await waitForReply(locMsgSent.key.id, validLocs, 60000);

            if (!locPicked) {
                return conn.sendMessage(from, {
                    text: `꒰ᵎ ⏰ *Time Out* ᵎ꒱\n\n⌛ 60s expired! Use *${prefix}v2ray* again.\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
                }, { quoted: locMsgSent });
            }

            const selectedLoc = locations[parseInt(locPicked.text) - 1];
            await conn.sendMessage(from, { react: { text: '✅', key: locPicked.msg.key } });

            // ════════════════════════════════════════════════════
            // STEP 2: Fetch & show packages for selected location
            // ════════════════════════════════════════════════════
            const pkgRes = await axios.get(`${API}/api/v2raysv=${selectedLoc.id}`, { timeout: 10000 });
            const packages = pkgRes.data?.packages || [];

            if (!packages.length) {
                return conn.sendMessage(from, {
                    text: `꒰ᵎ ❌ *V2Ray* ᵎ꒱\n\n⚠️ No packages for ${LOC_LABELS[selectedLoc.id]}!\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
                }, { quoted: locPicked.msg });
            }

            let pkgMsg = `꒰ᵎ 📦 *V2Ray Packages* ᵎ꒱\n\n`;
            pkgMsg += `📍 *Location:* ${LOC_LABELS[selectedLoc.id]}\n\n`;
            pkgMsg += `✨ *Available Packages:*\n\n`;
            packages.forEach((pkg, i) => {
                pkgMsg += `　*${i + 1}.* ${pkg.name}\n`;
                pkgMsg += `　　🏷️ ISP: ${pkg.isp.toUpperCase()}  •  ID: \`${pkg.pkgId}\`\n\n`;
            });
            pkgMsg += `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n> 💬 *Reply 1-${packages.length} to select*`;

            const pkgMsgSent = await conn.sendMessage(from, {
                text: pkgMsg,
                contextInfo: nlCtx
            }, { quoted: locPicked.msg });

            // ── Wait for package selection ───────────────────────
            const validPkgs = packages.map((_, i) => String(i + 1));
            const pkgPicked = await waitForReply(pkgMsgSent.key.id, validPkgs, 60000);

            if (!pkgPicked) {
                return conn.sendMessage(from, {
                    text: `꒰ᵎ ⏰ *Time Out* ᵎ꒱\n\n⌛ 60s expired! Use *${prefix}v2ray* again.\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
                }, { quoted: pkgMsgSent });
            }

            const selectedPkg = packages[parseInt(pkgPicked.text) - 1];
            await conn.sendMessage(from, { react: { text: '⏳', key: pkgPicked.msg.key } });

            // ════════════════════════════════════════════════════
            // STEP 3: Fetch V2Ray config
            // ════════════════════════════════════════════════════
            await conn.sendMessage(from, {
                text: `꒰ᵎ ⏳ *Fetching Config...* ᵎ꒱\n\n🔐 Generating encrypted tunnel for *${selectedPkg.name}*...\n\nPlease wait...`
            }, { quoted: pkgPicked.msg });

            const cfgRes = await axios.get(`${API}/api/v2ray=${selectedPkg.pkgId}`, { timeout: 15000 });

            if (!cfgRes.data?.success || !cfgRes.data?.config) {
                return conn.sendMessage(from, {
                    text: `꒰ᵎ ❌ *V2Ray* ᵎ꒱\n\n⚠️ Config unavailable for *${selectedPkg.name}*!\n🔧 Under maintenance. Try another package.\n\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤`
                }, { quoted: pkgPicked.msg });
            }

            const config = cfgRes.data.config;

            // ── Calculate expiry (3 days from now) ───────────────
            const now = new Date();
            const expiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            const expiryStr = expiry.toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const updateStr = now.toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            // ════════════════════════════════════════════════════
            // STEP 4: Send config
            // ════════════════════════════════════════════════════
            const finalMsg =
                `꒰ᵎ 🔐 *V2Ray Config Ready* ᵎ꒱\n\n` +
                `🌐 *Location* ➜ ${LOC_LABELS[selectedLoc.id]}\n` +
                `📦 *Package* ➜ ${selectedPkg.name}\n` +
                `🏷️ *ISP* ➜ ${selectedPkg.isp.toUpperCase()}\n` +
                `🔒 *Protocol* ➜ VLESS / SSL\n` +
                `📶 *Bandwidth* ➜ Unlimited\n` +
                `⏳ *Duration* ➜ 03 Days\n` +
                `📅 *Updated* ➜ ${updateStr}\n` +
                `⚠️ *Expires* ➜ ${expiryStr}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `🔑 *Config String:*\n\n` +
                `\`\`\`${config}\`\`\`\n` +
                `━━━━━━━━━━━━━━━━━━━━\n\n` +
                `📌 *How to use:*\n` +
                `　1️⃣ Copy the config string above\n` +
                `　2️⃣ Open *V2RayNG* / *NapsternetV*\n` +
                `　3️⃣ Import → Paste config\n` +
                `　4️⃣ Connect & enjoy! 🚀\n\n` +
                `　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n` +
                `*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`;

            await conn.sendMessage(from, {
                image: { url: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/ec3cfdeffa9a4522c0a8eb3f09ee5767.jpg' },
                caption: finalMsg,
                contextInfo: nlCtx
            }, { quoted: pkgPicked.msg });

            await conn.sendMessage(from, { react: { text: '✅', key: pkgPicked.msg.key } });

        } catch (e) {
            reply(
                `꒰ᵎ ❌ *Error* ᵎ꒱\n\n⚠️ ${e.message}\n\n　　˚₊‧꒰ა 🌸 ໒꒱‧₊˚\n*ᴍᴇᴢᴜᴋᴀ ᴍᴅ ᴠ4* 🖤 | *ʙʟᴀᴄᴋ ᴄᴀᴛ ᴏꜰᴄ*`
            );
            console.log('[v2ray] Error:', e);
        }
    }
};

