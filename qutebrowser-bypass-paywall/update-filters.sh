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

# Filter sources (using GitFlic.ru mirror due to GitLab access restrictions)
# Note: Qutebrowser doesn't support Greasemonkey, so we only use the adblock filter
declare -A FILTERS=(
    ["bpc-paywall-filter"]="https://gitflic.ru/project/magnolia1234/bypass-paywalls-clean-filters/blob/raw?file=bpc-paywall-filter.txt"
)

# Download each filter
for name in "${!FILTERS[@]}"; do
    url="${FILTERS[$name]}"
    echo "→ Downloading $name..."

    # Download with error handling
    DOWNLOAD_SUCCESS=false
    if command -v curl &> /dev/null; then
        if curl -fsSL "$url" -o "$TEMP_DIR/$name.tmp" 2>/dev/null; then
            DOWNLOAD_SUCCESS=true
        fi
    elif command -v wget &> /dev/null; then
        if wget -q "$url" -O "$TEMP_DIR/$name.tmp" 2>/dev/null; then
            DOWNLOAD_SUCCESS=true
        fi
    else
        echo "✗ Error: Neither curl nor wget found. Please install one of them."
        exit 1
    fi

    # Verify download was successful
    if [ "$DOWNLOAD_SUCCESS" = true ] && [ -s "$TEMP_DIR/$name.tmp" ]; then
        # Move temp file to final location
        mv "$TEMP_DIR/$name.tmp" "$FILTER_DIR/$name.txt"
        echo "  ✓ Updated $name.txt"
    else
        echo "  ✗ Failed to download $name (required)"
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
