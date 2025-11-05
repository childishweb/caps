#!/bin/bash
# Bypass Paywalls Clean for Qutebrowser - Installation Script

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Bypass Paywalls Clean for Qutebrowser Installer  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect qutebrowser config directory
if [ -n "$XDG_CONFIG_HOME" ]; then
    QUTE_CONFIG_DIR="$XDG_CONFIG_HOME/qutebrowser"
else
    QUTE_CONFIG_DIR="$HOME/.config/qutebrowser"
fi

echo -e "${BLUE}→${NC} Qutebrowser config directory: ${GREEN}$QUTE_CONFIG_DIR${NC}"

# Create directories if they don't exist
mkdir -p "$QUTE_CONFIG_DIR/bypass-paywalls"

echo -e "${BLUE}→${NC} Created directories"

# Copy the update script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/update-filters.sh" "$QUTE_CONFIG_DIR/bypass-paywalls/"
chmod +x "$QUTE_CONFIG_DIR/bypass-paywalls/update-filters.sh"

echo -e "${BLUE}→${NC} Copied update script"

# Run initial filter download
echo -e "${BLUE}→${NC} Downloading Bypass Paywalls Clean filters..."
"$QUTE_CONFIG_DIR/bypass-paywalls/update-filters.sh"

# Check if config.py exists
if [ ! -f "$QUTE_CONFIG_DIR/config.py" ]; then
    echo -e "${YELLOW}⚠${NC}  No config.py found. Creating one..."
    cp "$SCRIPT_DIR/config.py.example" "$QUTE_CONFIG_DIR/config.py"
    echo -e "${GREEN}✓${NC} Created config.py"
else
    echo -e "${YELLOW}⚠${NC}  config.py already exists"
    echo -e "${BLUE}→${NC} Please add the following to your config.py:"
    echo ""
    cat "$SCRIPT_DIR/config.py.example"
    echo ""
fi

# Setup auto-update cron job (optional)
echo ""
echo -e "${BLUE}→${NC} Would you like to set up automatic weekly filter updates? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    CRON_CMD="0 3 * * 0 $QUTE_CONFIG_DIR/bypass-paywalls/update-filters.sh"
    (crontab -l 2>/dev/null | grep -v "bypass-paywalls/update-filters.sh"; echo "$CRON_CMD") | crontab -
    echo -e "${GREEN}✓${NC} Configured weekly automatic updates (Sundays at 3 AM)"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Installation Complete! 🎉                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Restart qutebrowser: ${YELLOW}:restart${NC}"
echo -e "  2. Verify filters are loaded: ${YELLOW}:adblock-update${NC}"
echo -e "  3. Update filters manually: ${YELLOW}$QUTE_CONFIG_DIR/bypass-paywalls/update-filters.sh${NC}"
echo ""
echo -e "${BLUE}Supported sites:${NC} 500+ news sites including:"
echo -e "  • New York Times, Washington Post, Wall Street Journal"
echo -e "  • Bloomberg, Financial Times, The Economist"
echo -e "  • Medium, Wired, The Atlantic"
echo -e "  • And many more!"
echo ""
