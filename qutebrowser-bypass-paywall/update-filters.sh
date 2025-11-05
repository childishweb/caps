#!/bin/bash
# Bypass Paywalls Clean for Qutebrowser - Filter Update Script

set -e

# Detect qutebrowser config directory
if [ -n "$XDG_CONFIG_HOME" ]; then
    QUTE_CONFIG_DIR="$XDG_CONFIG_HOME/qutebrowser"
else
    QUTE_CONFIG_DIR="$HOME/.config/qutebrowser"
fi

FILTER_DIR="$QUTE_CONFIG_DIR/bypass-paywalls"
TEMP_DIR="$FILTER_DIR/temp"

# Create directories
mkdir -p "$FILTER_DIR"
mkdir -p "$TEMP_DIR"

echo "╔════════════════════════════════════════════════════╗"
echo "║     Bypass Paywalls Clean - Filter Updater         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Filter sources
declare -A FILTERS=(
    ["bpc-paywall-filter"]="https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/bpc-paywall-filter.txt"
    ["bpc-script-filter"]="https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.en.user.js"
)

# Download each filter
for name in "${!FILTERS[@]}"; do
    url="${FILTERS[$name]}"
    echo "→ Downloading $name..."

    if command -v curl &> /dev/null; then
        curl -fsSL "$url" -o "$TEMP_DIR/$name.tmp"
    elif command -v wget &> /dev/null; then
        wget -q "$url" -O "$TEMP_DIR/$name.tmp"
    else
        echo "✗ Error: Neither curl nor wget found. Please install one of them."
        exit 1
    fi

    # Verify download was successful
    if [ -s "$TEMP_DIR/$name.tmp" ]; then
        # Move temp file to final location
        if [[ "$name" == *"script"* ]]; then
            mv "$TEMP_DIR/$name.tmp" "$QUTE_CONFIG_DIR/greasemonkey/bypass-paywalls-clean.js"
            echo "  ✓ Installed userscript to greasemonkey/"
        else
            mv "$TEMP_DIR/$name.tmp" "$FILTER_DIR/$name.txt"
            echo "  ✓ Updated $name.txt"
        fi
    else
        echo "  ✗ Failed to download $name"
        rm -f "$TEMP_DIR/$name.tmp"
    fi
done

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Get filter statistics
if [ -f "$FILTER_DIR/bpc-paywall-filter.txt" ]; then
    RULE_COUNT=$(grep -c "^||" "$FILTER_DIR/bpc-paywall-filter.txt" 2>/dev/null || echo "0")
    FILE_SIZE=$(du -h "$FILTER_DIR/bpc-paywall-filter.txt" | cut -f1)
    echo ""
    echo "╔════════════════════════════════════════════════════╗"
    echo "║              Update Complete! ✓                    ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo ""
    echo "Statistics:"
    echo "  • Filter rules: $RULE_COUNT"
    echo "  • Filter size: $FILE_SIZE"
    echo "  • Updated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "Restart qutebrowser or run ':adblock-update' to apply changes"
else
    echo ""
    echo "✗ Error: Filter file not found after download"
    exit 1
fi

# Save last update timestamp
echo "$(date +%s)" > "$FILTER_DIR/last-update"
