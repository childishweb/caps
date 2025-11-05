# 🚀 Bypass Paywalls Clean for Qutebrowser

A comprehensive solution to integrate **Bypass Paywalls Clean** filters into [qutebrowser](https://qutebrowser.org/), allowing you to read articles from 500+ paywalled news sites.

## ✨ Features

- 🔄 **Automatic Filter Updates**: Download and update Bypass Paywalls Clean filters
- 🎯 **Easy Installation**: One-command setup script
- 📰 **500+ Supported Sites**: Works with major news outlets including:
  - New York Times, Washington Post, Wall Street Journal
  - Bloomberg, Financial Times, The Economist
  - Medium, Wired, The Atlantic, Fortune
  - And hundreds more!
- 🛡️ **Privacy-Focused**: All filters run locally, no data sent to external servers
- ⚙️ **Fully Configurable**: Customize to your needs
- 🚀 **Adblock-Powered**: Uses qutebrowser's built-in content blocking

## 📋 Requirements

- **qutebrowser** (version 2.0.0 or later)
- **python-adblock** package (install via `sudo pacman -S python-adblock` on Arch, or `pip install adblock` on other systems)
- **curl** or **wget** (for downloading filters)
- Linux/macOS/BSD (Windows with WSL should work too)

## 🚀 Quick Start

### Installation

```bash
# Clone this repository
git clone https://github.com/childishweb/qutebrowser-bypass-paywall.git
cd qutebrowser-bypass-paywall

# Install python-adblock if not already installed
# On Arch Linux:
sudo pacman -S python-adblock
# On other systems:
# pip install --user adblock

# Run the installer
chmod +x install.sh
./install.sh
```

The installer will:
1. Create necessary directories in your qutebrowser config
2. Download the latest Bypass Paywalls Clean filters from GitFlic.ru mirror
3. Set up configuration (or guide you to do so)
4. Optionally configure automatic weekly updates via cron

### Manual Installation

If you prefer manual installation:

```bash
# 1. Create directory
mkdir -p ~/.config/qutebrowser/bypass-paywalls

# 2. Copy scripts
cp update-filters.sh ~/.config/qutebrowser/bypass-paywalls/
chmod +x ~/.config/qutebrowser/bypass-paywalls/update-filters.sh

# 3. Download filters
~/.config/qutebrowser/bypass-paywalls/update-filters.sh

# 4. Add configuration to ~/.config/qutebrowser/config.py
cat config.py.example >> ~/.config/qutebrowser/config.py
```

## 🔧 Configuration

The installer creates or updates your `~/.config/qutebrowser/config.py`. Three configuration levels are available in `config.py.example`:

### Filter List Options

**🎯 OPTION 1: BALANCED (Recommended - Default)**
- **~160K filters** - Good performance, great blocking
- Includes:
  - ✅ Bypass Paywalls Clean (local)
  - ✅ EasyList (ads)
  - ✅ EasyPrivacy (tracking)
  - ✅ Fanboy's Enhanced Tracking (recommended with BPC)
  - ✅ Fanboy's Cookie Monster (removes cookie notices)
  - ✅ EasyList Annoyances (popups, newsletters)
- **Best for:** Most users who want effective blocking without slowdowns

**💪 OPTION 2: AGGRESSIVE (Power Users)**
- **~300K+ filters** - Maximum blocking power
- Everything from Balanced, plus:
  - ✅ AdGuard Base + Tracking Protection + URL Tracking
  - ✅ AdGuard Cookie Notices + Annoyances
  - ✅ Social widgets blocking
  - ⚠️ Optional: Malware & phishing protection
- **Best for:** Privacy-focused users, slower but more thorough
- **Warning:** May break some sites, requires whitelisting

**⚡ OPTION 3: MINIMAL (Performance)**
- **~100K filters** - Fastest option
- Includes only:
  - ✅ Bypass Paywalls Clean (priority)
  - ✅ EasyList (basic ads)
  - ✅ EasyPrivacy (basic tracking)
- **Best for:** Older hardware or users who prioritize speed

### Example Configuration (Balanced)

```python
config.load_autoconfig()

# Enable content blocking with Balanced filters
c.content.blocking.enabled = True
c.content.blocking.method = "both"

config.set('content.blocking.adblock.lists', [
    str(bypass_filter_path.as_uri()),  # Bypass Paywalls Clean
    "https://easylist.to/easylist/easylist.txt",
    "https://easylist.to/easylist/easyprivacy.txt",
    "https://secure.fanboy.co.nz/enhancedstats.txt",
    "https://secure.fanboy.co.nz/fanboy-cookiemonster.txt",
    "https://easylist-downloads.adblockplus.org/easylist-annoyances.txt",
])
```

See `config.py.example` for all three options with detailed comments.

## 📖 Usage

### Basic Commands

After installation, restart qutebrowser:

```
:restart
```

Update filters manually:

```
:spawn --userscript ~/.config/qutebrowser/bypass-paywalls/update-filters.sh
```

Or use the keyboard shortcut (if configured):

```
Ctrl+Shift+R
```

Reload adblock filters without restarting:

```
:adblock-update
```

### Updating Filters

**Manual Update:**
```bash
~/.config/qutebrowser/bypass-paywalls/update-filters.sh
```

**Automatic Updates:**

The installer can set up a weekly cron job:
```cron
0 3 * * 0 ~/.config/qutebrowser/bypass-paywalls/update-filters.sh
```

Or add to your shell startup file:
```bash
# Update filters if older than 7 days
FILTER_DIR="$HOME/.config/qutebrowser/bypass-paywalls"
if [ -f "$FILTER_DIR/last-update" ]; then
    LAST_UPDATE=$(cat "$FILTER_DIR/last-update")
    NOW=$(date +%s)
    WEEK=604800
    if [ $((NOW - LAST_UPDATE)) -gt $WEEK ]; then
        "$FILTER_DIR/update-filters.sh"
    fi
fi
```

## 🌐 Supported Sites

This project uses the official Bypass Paywalls Clean filters, which support 500+ sites including:

### News & Media
- New York Times, Washington Post, Wall Street Journal
- Los Angeles Times, Boston Globe, Chicago Tribune
- The Guardian, The Telegraph, The Independent (UK)
- Le Monde, Le Figaro (France)
- And many more regional and international news sites

### Business & Finance
- Bloomberg, Financial Times, The Economist
- Forbes, Fortune, Inc., Fast Company
- Harvard Business Review, MIT Technology Review

### Technology & Science
- Wired, MIT Technology Review, Scientific American
- IEEE Spectrum, Popular Science

### Culture & Lifestyle
- The Atlantic, The New Yorker, Vanity Fair
- Medium (all publications), Substack newsletters

For a complete list, see: [Bypass Paywalls Clean - Supported Sites](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters)

## 🛠️ Troubleshooting

### Filters Not Working

1. **Check filter file exists:**
   ```bash
   ls -la ~/.config/qutebrowser/bypass-paywalls/bpc-paywall-filter.txt
   ```

2. **Verify configuration:**
   ```
   :set content.blocking.enabled
   :set content.blocking.adblock.lists
   ```

3. **Update filters:**
   ```bash
   ~/.config/qutebrowser/bypass-paywalls/update-filters.sh
   ```

4. **Restart qutebrowser:**
   ```
   :restart
   ```

### Site Still Paywalled

Some sites require additional steps:

1. **Clear cookies:**
   ```
   :clear-cookies
   ```

2. **Try private browsing:**
   ```
   :open -p <url>
   ```

3. **Check if site is supported:**
   Visit the [official filter repository](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters)

4. **Disable JavaScript temporarily:**
   ```
   :set -u <url> content.javascript.enabled false
   ```

### Permission Errors

Make scripts executable:
```bash
chmod +x ~/.config/qutebrowser/bypass-paywalls/update-filters.sh
```

## 🔄 Uninstallation

```bash
# Run the uninstall script
./uninstall.sh

# Or manually:
# Remove filters and scripts
rm -rf ~/.config/qutebrowser/bypass-paywalls

# Remove configuration (edit config.py manually)
# Remove the Bypass Paywalls Clean section from:
# ~/.config/qutebrowser/config.py

# Remove cron job (if installed)
crontab -e
# Delete the line containing: bypass-paywalls/update-filters.sh
```

## 📚 How It Works

This solution integrates Bypass Paywalls Clean into qutebrowser using content blocking:

**Content Blocking**: Uses qutebrowser's built-in adblock functionality (powered by python-adblock/Brave's adblock engine) to load filter rules that:
- Remove paywall elements and overlays
- Block tracking scripts
- Prevent article-limit counters
- Bypass cookie-based restrictions

The filters are downloaded from the [GitFlic.ru mirror](https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters) of the official Bypass Paywalls Clean Filters repository, maintained by magnolia1234.

## 🔒 Privacy & Ethics

### Privacy
- All filters run **locally** on your machine
- **No data** is sent to external servers
- No tracking or analytics

### Ethics
**Important Note**: This tool is for educational purposes. Consider:

- 🎓 **Support Journalism**: If you regularly read a publication, consider subscribing
- 💰 **Pay for Value**: Quality journalism requires funding
- 🎯 **Use Responsibly**: Use this tool for occasional access or research purposes
- 📰 **Respect Copyright**: Be aware of your local laws regarding paywall circumvention

Many publications offer:
- Free articles per month
- Student/educator discounts
- Library access programs
- Email newsletter alternatives

## 🤝 Contributing

Contributions are welcome! Please note:

- **Filter Issues**: Report to [Bypass Paywalls Clean Filters](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters)
- **Script Issues**: Open an issue in this repository
- **New Features**: Submit a pull request

## 📜 License

This project is licensed under the MIT License.

**Note**: This is a configuration tool for qutebrowser. The actual Bypass Paywalls Clean filters are maintained by [magnolia1234](https://gitlab.com/magnolia1234) and have their own license.

## 🙏 Credits

- **Bypass Paywalls Clean**: Created and maintained by [magnolia1234](https://gitlab.com/magnolia1234)
- **Qutebrowser**: The excellent keyboard-focused browser by [The Compiler](https://www.qutebrowser.org/)
- **Filter Lists**: Based on [Bypass Paywalls Clean Filters](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters)

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Questions**: Check the [qutebrowser documentation](https://qutebrowser.org/doc/)
- **Updates**: Star the repo for updates

## 🔗 Related Projects

- [Bypass Paywalls Clean (Browser Extension)](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean)
- [Qutebrowser](https://qutebrowser.org/)
- [uBlock Origin](https://github.com/gorhill/uBlock) (similar concept for other browsers)

---

**Disclaimer**: This tool is provided as-is for educational purposes. Use responsibly and in accordance with your local laws and the terms of service of the websites you visit. The authors are not responsible for any misuse of this tool.

Made with ❤️ for the qutebrowser community
