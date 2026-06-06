// ==========================================
// CENTRALIZED IMAGE MAP FOR MEZUKA MD V5 BOT
// ==========================================

const IMAGES = { 
    // === Node.js Backend & WhatsApp Commands ===
    DEFAULT_LOGO: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    PAIR_IMG_ALTERNATIVE: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    N8AN5Z: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    IXYRRZ: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    AEEO1I: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    FB_CMD: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    ADMIN_CMD: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    OWNER_CMD: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg', 
    SCRAPPER_THUMB: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    IBB_LOGO: 'https://raw.githubusercontent.com/NimeshMihiranga-Neno/Mezuka-help/main/IMG-20260606-WA0008(1).jpg',
    
    // === HTML Frontend Web UI ===
    WEB_LOGO: 'https://files.catbox.moe/qhrzt2.jpg',
    WEB_BG: 'https://files.catbox.moe/hlg0kl.jpg',
    TEAM_NIMESHKA: 'https://files.catbox.moe/sfe9ad.jpg',
    TEAM_MANISH: 'https://files.catbox.moe/fw4btt.jpg',
    TEAM_THENUJA: 'https://files.catbox.moe/my5uuf.jpg',
    TEAM_VINUSHA: 'https://files.catbox.moe/nz2421.jpg',
    TEAM_NETHUSHA: 'https://files.catbox.moe/hdhwxf.jpg',
    TEAM_HARSHI: 'https://files.catbox.moe/pfw1kf.jpg'
};

// Export as CommonJS module for the Node.js backend
if (typeof module !== 'undefined' && module.exports) { 
    module.exports = IMAGES;
}

// Map globally for the static Mezuka Web UI if loaded via <script>
if (typeof window !== 'undefined') {
    window.IMAGES = IMAGES;
}
