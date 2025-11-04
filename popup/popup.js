// Popup script for AI Focus Agent

let currentSettings = null;

// Format time duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

// Categorize site for display
function categorizeSite(url) {
  if (!url || !currentSettings) return 'unknown';

  const urlLower = url.toLowerCase();

  // Check focus domains
  for (const domain of currentSettings.focusDomains) {
    if (urlLower.includes(domain.toLowerCase())) {
      return 'focus';
    }
  }

  // Check productive keywords
  for (const keyword of currentSettings.productiveKeywords) {
    if (urlLower.includes(keyword.toLowerCase())) {
      return 'productive';
    }
  }

  // Check distracting patterns
  for (const pattern of currentSettings.distractingPatterns) {
    if (urlLower.includes(pattern.toLowerCase())) {
      return 'distracting';
    }
  }

  return 'neutral';
}

// Update stats display
function updateStats() {
  browser.runtime.sendMessage({ type: 'getStats' }).then((stats) => {
    // Session time
    const sessionDuration = Date.now() - stats.sessionStartTime;
    document.getElementById('sessionTime').textContent = formatDuration(sessionDuration);

    // Distraction count
    document.getElementById('distractionCount').textContent = stats.warningCount;

    // Current site category
    if (stats.currentSite) {
      const category = categorizeSite(stats.currentSite);
      const categoryEmoji = {
        focus: '🎯',
        productive: '✅',
        neutral: '➖',
        distracting: '⚠️',
        unknown: '❓'
      };

      const categoryText = category.charAt(0).toUpperCase() + category.slice(1);
      document.getElementById('currentCategory').textContent =
        `${categoryEmoji[category]} ${categoryText}`;
    }

    // Update status message
    updateStatusMessage(stats);
  });
}

// Update status message based on current state
function updateStatusMessage(stats) {
  const statusDiv = document.getElementById('statusMessage');

  if (stats.consecutiveDistractions === 0) {
    statusDiv.className = 'status-message';
    statusDiv.textContent = "You're doing great! Stay focused! 🚀";
  } else if (stats.consecutiveDistractions === 1) {
    statusDiv.className = 'status-message warning';
    statusDiv.textContent = "Minor distraction detected. Let's refocus! 💪";
  } else if (stats.consecutiveDistractions === 2) {
    statusDiv.className = 'status-message warning';
    statusDiv.textContent = "Getting distracted again. Consider taking a break? ⏸️";
  } else {
    statusDiv.className = 'status-message danger';
    statusDiv.textContent = "Multiple distractions! Time for a real break or serious refocus. 🔥";
  }
}

// Load and display focus domains
function loadFocusDomains() {
  browser.runtime.sendMessage({ type: 'getSettings' }).then((response) => {
    currentSettings = response.settings;
    displayFocusDomains();
  });
}

// Display focus domains as tags
function displayFocusDomains() {
  const focusList = document.getElementById('focusList');
  focusList.innerHTML = '';

  if (currentSettings.focusDomains.length === 0) {
    focusList.innerHTML = '<div class="empty-state">No focus domains yet. Add one above!</div>';
    return;
  }

  currentSettings.focusDomains.forEach((domain) => {
    const tag = document.createElement('div');
    tag.className = 'focus-tag';
    tag.innerHTML = `
      <span>${domain}</span>
      <button data-domain="${domain}">×</button>
    `;
    focusList.appendChild(tag);
  });

  // Add remove handlers
  focusList.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFocusDomain(btn.dataset.domain);
    });
  });
}

// Add focus domain
function addFocusDomain(domain) {
  if (!domain || domain.trim() === '') return;

  domain = domain.trim().toLowerCase();

  if (!currentSettings.focusDomains.includes(domain)) {
    currentSettings.focusDomains.push(domain);
    browser.runtime.sendMessage({
      type: 'updateSettings',
      settings: currentSettings
    }).then(() => {
      displayFocusDomains();
      document.getElementById('focusDomain').value = '';
    });
  }
}

// Remove focus domain
function removeFocusDomain(domain) {
  currentSettings.focusDomains = currentSettings.focusDomains.filter(
    (d) => d !== domain
  );

  browser.runtime.sendMessage({
    type: 'updateSettings',
    settings: currentSettings
  }).then(() => {
    displayFocusDomains();
  });
}

// Event listeners
document.getElementById('addFocus').addEventListener('click', () => {
  const domain = document.getElementById('focusDomain').value;
  addFocusDomain(domain);
});

document.getElementById('focusDomain').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const domain = document.getElementById('focusDomain').value;
    addFocusDomain(domain);
  }
});

document.getElementById('resetStats').addEventListener('click', () => {
  if (confirm('Reset session stats? This will clear distraction count and time tracking.')) {
    browser.runtime.sendMessage({ type: 'resetStats' }).then(() => {
      updateStats();
    });
  }
});

document.getElementById('openOptions').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

// Initialize
loadFocusDomains();
updateStats();

// Update stats every second
setInterval(updateStats, 1000);
