const fs = require('fs');
const path = require('path');

// Live Map - same reference always, just .clear() + refill on reload
const commands = new Map();
const buttonHandlers = new Map();

function loadCommands() {
    commands.clear();

    const commandDir = path.join(__dirname, 'command');

    if (!fs.existsSync(commandDir)) {
        console.log('⚠️ command/ folder not found, skipping command loader.');
        return;
    }

    const files = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));

    for (const file of files) {
        try {
            const filePath = path.join(commandDir, file);
            // Clear cache for hot-reload
            delete require.cache[require.resolve(filePath)];
            const cmd = require(filePath);

            if (!cmd.name || typeof cmd.execute !== 'function') {
                console.log(`⚠️ Skipping ${file}: missing name or execute()`);
                continue;
            }

            // Register main name
            commands.set(cmd.name.toLowerCase(), cmd);

            // Register aliases
            if (Array.isArray(cmd.aliases)) {
                for (const alias of cmd.aliases) {
                    commands.set(alias.toLowerCase(), cmd);
                }
            }

        } catch (err) {
            console.error(`❌ Failed to load ${file}:`, err.message);
        }
    }

    console.log(`📦 Commands loaded: ${files.length} files | ${commands.size} triggers`);
}

// Load button handlers
function loadButtonHandlers() {
    buttonHandlers.clear();

    const commandDir = path.join(__dirname, 'command');

    if (!fs.existsSync(commandDir)) {
        return;
    }

    const files = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));

    for (const file of files) {
        try {
            const filePath = path.join(commandDir, file);
            const cmd = require(filePath);

            // Register button handlers if they exist
            if (cmd.buttons && typeof cmd.buttons === 'object') {
                for (const [buttonId, handler] of Object.entries(cmd.buttons)) {
                    if (typeof handler === 'function') {
                        buttonHandlers.set(buttonId.toLowerCase(), { 
                            handler, 
                            command: cmd.name 
                        });
                    }
                }
            }

        } catch (err) {
            console.error(`❌ Failed to load buttons from ${file}:`, err.message);
        }
    }

    if (buttonHandlers.size > 0) {
        console.log(`🔘 Button handlers loaded: ${buttonHandlers.size} buttons`);
    }
}

// Initial load at startup
loadCommands();
loadButtonHandlers();

// reload() - call this for hot-reload without restart
function reload() {
    // Clear loader cache itself too
    delete require.cache[require.resolve(__filename)];
    loadCommands();
    loadButtonHandlers();
    return commands.size;
}

module.exports = { commands, buttonHandlers, reload };
