// Options page script for AI Focus Agent

let settings = null;

// Default settings
const defaultSettings = {
  focusDomains: [],
  productiveKeywords: ['github', 'stackoverflow', 'documentation', 'docs', 'learn', 'tutorial', 'course'],
  distractingPatterns: [
    'youtube.com/watch',
    'reddit.com',
    'twitter.com',
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'netflix.com',
    'twitch.tv',
    'news',
    'sports',
    'gaming'
  ],
  focusSessionMinutes: 25,
  distractionThresholdSeconds: 60,
  enableNotifications: true,
  strictMode: false
};

// Load settings from storage
function loadSettings() {
  browser.runtime.sendMessage({ type: 'getSettings' }).then((response) => {
    settings = response.settings;
    displaySettings();
  });
}

// Display all settings in the UI
function displaySettings() {
  // Basic settings
  document.getElementById('distractionThreshold').value = settings.distractionThresholdSeconds;
  document.getElementById('focusSessionMinutes').value = settings.focusSessionMinutes;
  document.getElementById('enableNotifications').checked = settings.enableNotifications;
  document.getElementById('strictMode').checked = settings.strictMode;

  // Lists
  displayList('productiveKeywordsList', settings.productiveKeywords, 'productiveKeyword');
  displayList('distractingPatternsList', settings.distractingPatterns, 'distractingPattern');
  displayList('focusDomainsList', settings.focusDomains, 'focusDomain');
}

// Display a list of tags
function displayList(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-list">No items yet. Add one above!</div>';
    return;
  }

  items.forEach((item) => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
      <span>${item}</span>
      <button data-type="${type}" data-value="${item}">×</button>
    `;
    container.appendChild(tag);
  });

  // Add remove handlers
  container.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeItem(btn.dataset.type, btn.dataset.value);
    });
  });
}

// Add item to a list
function addItem(type, value) {
  if (!value || value.trim() === '') return;

  value = value.trim().toLowerCase();

  let listName;
  switch (type) {
    case 'productiveKeyword':
      listName = 'productiveKeywords';
      break;
    case 'distractingPattern':
      listName = 'distractingPatterns';
      break;
    case 'focusDomain':
      listName = 'focusDomains';
      break;
    default:
      return;
  }

  if (!settings[listName].includes(value)) {
    settings[listName].push(value);
    displaySettings();

    // Clear input
    const input = document.getElementById(type);
    if (input) input.value = '';
  }
}

// Remove item from a list
function removeItem(type, value) {
  let listName;
  switch (type) {
    case 'productiveKeyword':
      listName = 'productiveKeywords';
      break;
    case 'distractingPattern':
      listName = 'distractingPatterns';
      break;
    case 'focusDomain':
      listName = 'focusDomains';
      break;
    default:
      return;
  }

  settings[listName] = settings[listName].filter((item) => item !== value);
  displaySettings();
}

// Save settings
function saveSettings() {
  // Get basic settings from inputs
  settings.distractionThresholdSeconds = parseInt(
    document.getElementById('distractionThreshold').value
  );
  settings.focusSessionMinutes = parseInt(
    document.getElementById('focusSessionMinutes').value
  );
  settings.enableNotifications = document.getElementById('enableNotifications').checked;
  settings.strictMode = document.getElementById('strictMode').checked;

  // Save to storage via background script
  browser.runtime.sendMessage({
    type: 'updateSettings',
    settings: settings
  }).then(() => {
    // Show success message
    const message = document.getElementById('saveMessage');
    message.classList.remove('hidden');
    setTimeout(() => {
      message.classList.add('hidden');
    }, 3000);
  });
}

// Reset to defaults
function resetToDefaults() {
  if (confirm('Reset all settings to defaults? This cannot be undone.')) {
    settings = JSON.parse(JSON.stringify(defaultSettings));
    displaySettings();
    saveSettings();
  }
}

// Event listeners for adding items
document.getElementById('addProductiveKeyword').addEventListener('click', () => {
  const value = document.getElementById('productiveKeyword').value;
  addItem('productiveKeyword', value);
});

document.getElementById('productiveKeyword').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const value = document.getElementById('productiveKeyword').value;
    addItem('productiveKeyword', value);
  }
});

document.getElementById('addDistractingPattern').addEventListener('click', () => {
  const value = document.getElementById('distractingPattern').value;
  addItem('distractingPattern', value);
});

document.getElementById('distractingPattern').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const value = document.getElementById('distractingPattern').value;
    addItem('distractingPattern', value);
  }
});

document.getElementById('addFocusDomain').addEventListener('click', () => {
  const value = document.getElementById('focusDomain').value;
  addItem('focusDomain', value);
});

document.getElementById('focusDomain').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const value = document.getElementById('focusDomain').value;
    addItem('focusDomain', value);
  }
});

// Save and reset buttons
document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('resetDefaults').addEventListener('click', resetToDefaults);

// Initialize
loadSettings();
