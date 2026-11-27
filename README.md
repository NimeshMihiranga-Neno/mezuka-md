<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=MEZUKA%20MD%20V5&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Full%20Source%20Code%20%E2%80%A2%20Multi-Session%20WhatsApp%20Bot&descAlignY=60&descSize=18"/>

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=22&pause=1000&color=FFB6C1&center=true&vCenter=true&width=650&lines=Mezuka+MD+V5+%E2%80%93+Full+Source+Code+%F0%9F%92%99;Multi-Session+WhatsApp+Bot+%E2%9A%A1;80%2B+Commands+%2B+Web+Dashboard+%F0%9F%96%A5%EF%B8%8F;Powered+by+BLACK+CAT+OFC+%F0%9F%96%A4" alt="Typing SVG" />

<br/>

![Version](https://img.shields.io/badge/Version-5.0.0-FFB6C1?style=for-the-badge&logo=github&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Required-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-v7-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)

> ✧･ﾟ: **More than a bot… it's a feeling** 💘 :･ﾟ✧

</div>

---

## 💙 About

**Mezuka MD V5** is a feature-rich, **multi-session WhatsApp bot** built with Node.js, Express, MongoDB and the Baileys library. This repository contains the **complete source code**: the bot core, 80+ commands, and the web dashboard (pairing, settings, news, giveaway, shop and more).

Link as many WhatsApp numbers as you like — each user gets their own session and their own settings.

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **Multi-Session** | Many WhatsApp accounts on one server |
| 🔑 **Web Pairing** | Pair with a **pairing code** or **QR** from the browser |
| ⚙️ **Settings Dashboard** | Each user manages their own bot settings online |
| 💬 **Auto-Reply** | Custom auto-reply rules per user |
| 📥 **Downloaders** | Songs, videos, TikTok, Facebook, Instagram, APK, Google Drive, MEGA and more |
| 🖼️ **Media Tools** | Sticker maker, ATTP/TTP, emoji mix, to-image, to-MP3, background remover, TTS |
| 🎨 **AI / Image** | Image search & image generation commands |
| 👑 **Group Admin** | Kick, promote/demote, mute, ban, tag all/admins, group DP & bio, revoke link |
| 🛡️ **Owner Tools** | Sudo users, call blocking, profile picture, env control, update |
| 📰 **News & Giveaway** | Built-in news feed, comments and giveaway pages |
| 🛒 **Shop & Team Pages** | Ready-made web pages for your community |
| ⚡ **Fast & Light** | Heroku-ready (`Procfile` included), 460 MB memory cap |

## 🗂️ Project Structure

```
mezuka-md/
├── index.js            # Express server + session manager + pairing
├── main.js             # Core message handler
├── commandLoader.js    # Loads every file in /command
├── config.js           # Reads config.env
├── database.js         # MongoDB helpers
├── news.js / comment.js / giveaway.js
├── scrapper.js         # Scraper helpers
├── command/            # 80+ bot commands
├── lib/                # Helper functions
├── mezuka/             # Web dashboard (HTML pages)
├── Procfile            # Heroku / process config
└── config.env.example  # Environment template
```

## 🚀 Getting Started

### Requirements
- **Node.js 20.x** and npm 9+
- **MongoDB** database (free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works)
- **FFmpeg** (installed automatically via `ffmpeg-static`)

### Installation

```bash
# 1. Clone
git clone https://github.com/NimeshMihiranga-Neno/mezuka-md-full-source-code.git
cd mezuka-md-full-source-code

# 2. Install dependencies
npm install

# 3. Configure
cp config.env.example config.env
# open config.env and fill in your values

# 4. Start
npm start
```

Open `http://localhost:8001` in your browser, go to the **Pair** page, and link your WhatsApp number. 🎉

## ⚙️ Configuration

| Variable | Description | Default |
|---|---|---|
| `NENO_DATA` | Session data folder / name | `SESSIONS` |
| `BOT_NAME` | Bot display name | `Mezuka MD V5` |
| `OWNER_NAME` | Owner name | – |
| `OWNER_FROM` | Owner country | `Sri Lanka` |
| `OWNER_AGE` | Owner age (shown in menu) | – |
| `PRIFIX` | Command prefix | `.` |
| `NENO_LAN` | Bot language | `EN` |
| `ALIVE_MSG` | Message shown by the alive command | – |
| `MONGODB_URI` | **Required.** MongoDB connection string | – |
| `PORT` | Web server port | `8001` |

> ⚠️ **Never upload your real `config.env` to GitHub.** It contains your database password. Use `config.env.example` as the template (already set up in `.gitignore`).

## ☁️ Deployment

**Heroku / Railway / VPS**

```bash
# Procfile
web: node --max-old-space-size=460 index.js
```

Set the same variables from the table above in your host's **Environment / Config Vars** panel.

**VPS with PM2**

```bash
npm install -g pm2
pm2 start index.js --name mezuka-md
pm2 save
```

## 🤖 Command Categories

| Category | Examples |
|---|---|
| 📥 Download | `song` `video` `tiktok` `fb` `ig` `apk` `gdrive` `moviedl` |
| 🖼️ Media | `sticker` `attp` `ttp` `toimg` `tomp3` `rmbg` `tts` `fancy` |
| 👥 Group | `kick` `promote` `demote` `mute` `unmute` `tagall` `tagadmin` `revokelink` |
| 🛡️ Owner | `sudo` `unsudo` `ban` `unban` `setpp` `blockcall` `update` `env` |
| 🔧 Utility | `menu` `alive` `ping` `jid` `whois` `getpp` `google` `trt` `ss` |

Send `.menu` to the bot to see the full command list.

## ➕ Add Your Own Command

Drop a new `.js` file into the `command/` folder — `commandLoader.js` loads it automatically. Copy any existing command as a template.

## ⚠️ Disclaimer

This is an **unofficial** project, not affiliated with WhatsApp or Meta. Use it responsibly and follow WhatsApp's Terms of Service. The authors are not responsible for bans or misuse. Downloader commands fetch content from third-party services — respect copyright and local laws.

## 👑 Author

**Nimesh Mihiranga (Neno)** — Owner of **Kurox Dev** · Founder of **Black Cat Studio**

[![GitHub](https://img.shields.io/badge/GitHub-NimeshMihiranga--Neno-181717?style=for-the-badge&logo=github)](https://github.com/NimeshMihiranga-Neno)

## 📜 License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE).

---

<div align="center">

**💕 Made with love by BLACK CAT OFC 🖤**
**⭐ Star this repo if you like Mezuka MD!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling"/>

</div>
