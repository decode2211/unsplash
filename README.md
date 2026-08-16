# AuraTab

A minimal Chrome extension that replaces the new tab page with a beautiful random wallpaper from Unsplash, a live artistic clock, and a Google search bar.

## Features

- **Random wallpaper** — fetches a fresh landscape photo from the Unsplash API on every new tab, preloaded before display
- **Photographer credit** — proper Unsplash attribution linking back to the photographer's profile
- **Artistic clock designs** — four unique clock styles that rotate daily, automatically
- **Live clock engine** — drift-correcting tick engine that self-corrects when the tab is backgrounded or throttled
- **Google search** — search directly from the new tab, with a clear button and smooth focus animation
- **Persistent storage** — lightweight `localStorage` helper shared across all modules

## Clock Designs

The clock design changes each day, determined by date — no settings, no storage, always consistent.

| Design | Description |
|---|---|
| **Skyline Blocks** | Stacked colored bar segments per digit, lit from the bottom up |
| **Liquid Tubes** | Fluid-filled tubes that rise and fall with each digit value |
| **Ink Stamp** | Serif digits with a slight random tilt and a stamp-drop animation on change |
| **Shadow Cast** | Large digits with a directional shadow that drifts across the day like a sundial |

All designs respect `prefers-reduced-motion`.

## Preview

```
┌──────────────────────────────────────────┐
│                                          │
│           [ clock design ]              │
│                                          │
│     [ Search the web...          × ]    │
│                                          │
│                     Photo by X on Unsplash│
└──────────────────────────────────────────┘
```

## Setup

### 1. Get an Unsplash API key

1. Go to [unsplash.com/developers](https://unsplash.com/developers) and create a free account
2. Create a new application to get your **Access Key**

### 2. Configure the extension

Copy the example config and add your key:

```bash
cp js/config.example.js js/config.js
```

Open `js/config.js` and fill in your key:

```js
const UNSPLASH_ACCESS_KEY = "your_access_key_here";
```

> `config.js` is listed in `.gitignore` — your key will never be committed.

### 3. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked** and select this project folder
4. Open a new tab

## Project Structure

```
AuraTab/
├── assets/
│   └── icons/              # Extension icons (16, 48, 128px)
├── css/
│   └── style.css           # Layout, overlay, search bar, and all clock design styles
├── js/
│   ├── config.example.js   # API key template (safe to commit)
│   ├── config.js           # Your actual API key (gitignored)
│   ├── clock-engine.js     # Drift-correcting tick engine (no DOM knowledge)
│   ├── clock-designs.js    # Four clock designs + CLOCK_DESIGNS registry
│   ├── clock.js            # Picks today's design, mounts it, starts the engine
│   ├── storage.js          # Shared localStorage helper (AuraStorage)
│   ├── wallpaper.js        # Fetches and displays Unsplash wallpaper with attribution
│   ├── search.js           # Search bar logic (submit, clear, focus state)
│   └── main.js             # Entry point — kicks off wallpaper load on DOMContentLoaded
├── options/
│   ├── options.html        # Extension options page
│   └── options.js          # Options page logic
├── newtab.html             # New tab override page
└── manifest.json           # Chrome extension manifest (v3)
```

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Reserved for Chrome storage API (options/preferences) |
| `https://api.unsplash.com/*` | Fetch random photo metadata |
| `https://images.unsplash.com/*` | Load the full-resolution photo |

## Requirements

- Google Chrome or any Chromium-based browser with extension support
- A free [Unsplash Developer](https://unsplash.com/developers) account

## License

MIT
