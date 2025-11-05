# 🎯 AI Focus Agent

An intelligent Firefox browser extension that monitors your browsing activity and helps you stay focused by detecting distractions and gently guiding you back on track.

## Features

- **Real-time Distraction Detection**: Monitors your browsing and identifies when you visit distracting websites
- **Smart Notifications**: Sends friendly alerts when you've been distracted for too long
- **Customizable Focus Domains**: Define your work/study sites to stay on track
- **Productive & Distracting Patterns**: Configure keywords and URL patterns to categorize sites
- **Session Tracking**: Track your focus time, distractions, and current site category
- **Keyboard Shortcuts**: Quick access to focus mode, session reset, and popup with hotkeys
- **Focus Mode**: Toggle an active focus mode that helps you stay extra disciplined
- **Flexible Settings**: Customize alert thresholds, notification preferences, and more
- **Beautiful UI**: Clean, modern interface with gradient design

## How It Works

1. **Monitoring**: The extension continuously monitors which tabs you visit and how long you spend on each site
2. **Categorization**: Each site is categorized as:
   - 🎯 **Focus**: Your designated work/study domains
   - ✅ **Productive**: Sites with productive keywords (docs, tutorials, etc.)
   - ➖ **Neutral**: Regular sites
   - ⚠️ **Distracting**: Entertainment, social media, and other time-wasters
3. **Alerts**: When you spend too long on distracting sites, you'll receive a notification
4. **Stats**: Track your session time, distraction count, and current focus status

## Installation

### Method 1: Temporary Installation (For Testing)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`
5. The extension is now loaded temporarily (will be removed when Firefox closes)

### Method 2: Permanent Installation (Unsigned)

1. Open Firefox and navigate to `about:config`
2. Search for `xpinstall.signatures.required`
3. Set it to `false` (this allows unsigned extensions)
4. Package the extension:
   ```bash
   cd /path/to/extension
   zip -r ai-focus-agent.zip *
   ```
5. Navigate to `about:addons` in Firefox
6. Click the gear icon and select "Install Add-on From File"
7. Select the `ai-focus-agent.zip` file

### Method 3: For Developers (web-ext)

```bash
# Install web-ext if you haven't already
npm install -g web-ext

# Run the extension in a temporary Firefox instance
cd /path/to/extension
web-ext run

# Or build and sign for distribution
web-ext build
```

## Usage

### Quick Start

1. **Click the extension icon** in your toolbar to open the popup
2. **Add focus domains**: Type domains like `github.com` or `stackoverflow.com` where you want to stay focused
3. **Browse normally**: The extension will monitor your activity in the background
4. **Get notified**: When you get distracted, you'll receive a friendly notification

### Configuration

Click "Settings" in the popup to access detailed configuration:

#### Focus Configuration
- **Distraction Alert Threshold**: Set how long (in seconds) you can stay on a distracting site before getting alerted
- **Focus Session Duration**: Set your ideal focus session length (Pomodoro-style)
- **Enable Notifications**: Toggle browser notifications on/off

#### Customization
- **Productive Keywords**: Add keywords that indicate productive sites (e.g., "documentation", "tutorial", "learning")
- **Distracting Patterns**: Add URL patterns or domains that are distracting (e.g., "youtube.com/watch", "reddit.com")
- **Focus Domains**: Add your primary work/study domains

### Keyboard Shortcuts

Use these keyboard shortcuts for quick access to features:

- **`Ctrl+Shift+F`** - Toggle Focus Mode on/off
- **`Ctrl+Shift+R`** - Reset current focus session
- **`Ctrl+Shift+P`** - Open the extension popup

You can customize these shortcuts in Firefox by going to `about:addons` → clicking the gear icon → selecting "Manage Extension Shortcuts".

### Understanding the Popup

- **Session Time**: How long your current focus session has been running
- **Distractions**: Number of times you've been alerted this session
- **Current Site**: The category of the site you're currently on
- **Status Message**: Real-time feedback on your focus state

### Notification Levels

The extension escalates its messages based on consecutive distractions:

1. **First distraction**: Gentle reminder
2. **Second distraction**: Suggests taking a real break
3. **Multiple distractions**: More urgent messages about patterns

## Default Distracting Patterns

The extension comes pre-configured with common distracting sites:

- Social media: Facebook, Twitter, Instagram, TikTok, Reddit
- Video streaming: YouTube (watch pages), Netflix, Twitch
- News and sports sites
- Gaming sites

You can customize this list in the settings!

## Default Productive Keywords

Sites containing these keywords are marked as productive:

- github
- stackoverflow
- documentation / docs
- learn / learning
- tutorial
- course

## Privacy

This extension:
- ✅ Runs entirely locally on your machine
- ✅ Does NOT send any data to external servers
- ✅ Does NOT track your browsing history beyond the current session
- ✅ Stores settings locally in Firefox's storage
- ✅ Only monitors tab URLs and timing, not page content

## Development

### Project Structure

```
ai-focus-agent/
├── manifest.json          # Extension configuration
├── background.js          # Core monitoring logic
├── icons/                 # Extension icons
│   ├── icon-48.png
│   └── icon-96.png
├── popup/                 # Popup interface
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── options/              # Settings page
    ├── options.html
    ├── options.css
    └── options.js
```

### Key Components

- **background.js**: Main logic for tab monitoring, site categorization, and notification triggers
- **popup**: Quick access interface for focus domains and session stats
- **options**: Detailed configuration page for all settings

### Technologies Used

- Pure JavaScript (no frameworks)
- WebExtensions API
- Firefox Browser APIs (tabs, notifications, storage, alarms)

## Troubleshooting

### Notifications Not Appearing

1. Check Firefox notification permissions: `about:preferences#privacy`
2. Ensure notifications are enabled in the extension settings
3. Check your OS notification settings

### Extension Not Loading

1. Check browser console for errors: `about:debugging` > Inspect
2. Ensure all files are present in the extension directory
3. Verify manifest.json syntax is valid

### Sites Not Being Categorized Correctly

1. Open Settings and check your patterns
2. Add specific domains to Focus Domains for accurate tracking
3. Remember: patterns are case-insensitive and use substring matching

## Future Features

- [ ] Block distracting sites in strict mode
- [ ] Focus session timer with breaks
- [ ] Weekly/monthly analytics and reports
- [ ] Whitelist specific YouTube channels or Reddit communities
- [ ] Integration with productivity techniques (Pomodoro, time-blocking)
- [ ] Export focus statistics
- [ ] AI-powered pattern learning from your behavior

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License - feel free to use and modify as needed.

## Support

If you encounter issues or have suggestions, please open an issue on the project repository.

---

Made with 💜 by developers who also struggle to stay focused!
