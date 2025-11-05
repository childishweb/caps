#!/bin/bash
# Bypass Paywalls Clean for Qutebrowser - Uninstallation Script

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  Bypass Paywalls Clean - Uninstaller              ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect qutebrowser config directory
if [ -n "$XDG_CONFIG_HOME" ]; then
    QUTE_CONFIG_DIR="$XDG_CONFIG_HOME/qutebrowser"
else
    QUTE_CONFIG_DIR="$HOME/.config/qutebrowser"
fi

echo -e "${YELLOW}⚠${NC}  This will remove Bypass Paywalls Clean from qutebrowser"
echo -e "${YELLOW}⚠${NC}  Config directory: $QUTE_CONFIG_DIR"
echo ""
echo -e "Are you sure you want to continue? (yes/no)"
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS])$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}→${NC} Removing bypass-paywalls directory..."
if [ -d "$QUTE_CONFIG_DIR/bypass-paywalls" ]; then
    rm -rf "$QUTE_CONFIG_DIR/bypass-paywalls"
    echo -e "  ✓ Removed bypass-paywalls/"
else
    echo -e "  - bypass-paywalls/ not found"
fi

echo -e "${BLUE}→${NC} Removing Greasemonkey script..."
if [ -f "$QUTE_CONFIG_DIR/greasemonkey/bypass-paywalls-clean.js" ]; then
    rm -f "$QUTE_CONFIG_DIR/greasemonkey/bypass-paywalls-clean.js"
    echo -e "  ✓ Removed Greasemonkey script"
else
    echo -e "  - Greasemonkey script not found"
fi

echo -e "${BLUE}→${NC} Checking for cron jobs..."
if crontab -l 2>/dev/null | grep -q "bypass-paywalls/update-filters.sh"; then
    (crontab -l 2>/dev/null | grep -v "bypass-paywalls/update-filters.sh") | crontab -
    echo -e "  ✓ Removed cron job"
else
    echo -e "  - No cron job found"
fi

echo ""
echo -e "${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║         Uninstallation Complete                    ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠${NC}  Manual steps required:"
echo -e "  1. Edit ${BLUE}$QUTE_CONFIG_DIR/config.py${NC}"
echo -e "     Remove the Bypass Paywalls Clean configuration section"
echo -e "  2. Restart qutebrowser: ${BLUE}:restart${NC}"
echo ""
echo -e "Thank you for using Bypass Paywalls Clean for Qutebrowser!"
echo ""
