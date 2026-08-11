# UnsplashWall — AuraTab

A minimal Chrome extension that replaces the new tab page with a beautiful random wallpaper from Unsplash, a live clock, and a Google search bar.

## Features

- **Random wallpaper** — fetches a fresh landscape photo from the Unsplash API on every new tab
- **Photographer credit** — links back to the photographer's Unsplash profile
- **Live clock** — displays current time, updated every second
- **Google search** — search Google directly from the new tab page
- **Smooth transition** — 0.8s fade when the background image loads

## Preview

```
┌─────────────────────────────────────┐
│                                     │
│           12:34                     │
│                                     │
│    [ Search Google...         ]     │
│                                     │
│                        Photo by ... │
└─────────────────────────────────────┘
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

Then open `js/config.js` and fill in your key:

```js
const UNSPLASH_ACCESS_KEY = "your_access_key_here";
```

> `config.js` is listed in `.gitignore` so your key is never committed.

### 3. Load the extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked** and select this project folder
4. Open a new tab — you should see a wallpaper load

## Project Structure

```
UnsplashWall/
├── assets/
│   └── icons/          # Extension icons (16, 48, 128px)
├── css/
│   └── style.css       # Fullscreen layout and overlay styling
├── js/
│   ├── config.example.js   # API key template (safe to commit)
│   ├── config.js           # Your actual API key (gitignored)
│   ├── clock.js            # Clock module
│   ├── storage.js          # Chrome storage helpers
│   ├── wallpaper.js        # Wallpaper fetch and display
│   ├── search.js           # Search bar logic
│   └── main.js             # Entry point — wires everything together
├── options/
│   ├── options.html        # Extension options page
│   └── options.js          # Options page logic
├── newtab.html             # New tab override page
└── manifest.json           # Chrome extension manifest (v3)
```

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Persist user preferences via Chrome storage |
| `https://api.unsplash.com/*` | Fetch random photo metadata |
| `https://images.unsplash.com/*` | Load the full-resolution photo |

## Requirements

- Google Chrome (or any Chromium-based browser with extension support)
- A free [Unsplash Developer](https://unsplash.com/developers) account

## License

MIT
