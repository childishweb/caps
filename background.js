// AI Focus Agent - Background Script
// Monitors browsing activity and detects distractions

// State management
let currentTab = null;
let sessionStartTime = Date.now();
let siteVisits = {};
let currentSiteStartTime = null;
let warningCount = 0;
let isInFocusMode = false;
let consecutiveDistractions = 0;

// Default settings
let settings = {
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
  focusSessionMinutes: 25, // Pomodoro-style
  distractionThresholdSeconds: 60, // Alert after 60 seconds on distracting site
  enableNotifications: true,
  strictMode: false // In strict mode, blocks distracting sites
};

// Load settings from storage
browser.storage.local.get('settings').then((result) => {
  if (result.settings) {
    settings = { ...settings, ...result.settings };
  }
});

// Site categorization logic
function categorizeSite(url) {
  if (!url) return 'unknown';

  const urlLower = url.toLowerCase();

  // Check if it's a focus domain
  for (const domain of settings.focusDomains) {
    if (urlLower.includes(domain.toLowerCase())) {
      return 'focus';
    }
  }

  // Check for productive keywords
  for (const keyword of settings.productiveKeywords) {
    if (urlLower.includes(keyword.toLowerCase())) {
      return 'productive';
    }
  }

  // Check for distracting patterns
  for (const pattern of settings.distractingPatterns) {
    if (urlLower.includes(pattern.toLowerCase())) {
      return 'distracting';
    }
  }

  // Default to neutral
  return 'neutral';
}

// Track time spent on current site
function trackSiteTime(url) {
  if (currentSiteStartTime && currentTab) {
    const timeSpent = Date.now() - currentSiteStartTime;
    const domain = new URL(currentTab.url).hostname;

    if (!siteVisits[domain]) {
      siteVisits[domain] = {
        time: 0,
        visits: 0,
        category: categorizeSite(currentTab.url)
      };
    }

    siteVisits[domain].time += timeSpent;
    siteVisits[domain].visits += 1;
  }

  currentSiteStartTime = Date.now();
  currentTab = { url };
}

// Check if user is getting distracted
function checkForDistraction(url, timeOnSite) {
  const category = categorizeSite(url);

  if (category === 'distracting') {
    const secondsOnSite = timeOnSite / 1000;

    // Alert after threshold
    if (secondsOnSite > settings.distractionThresholdSeconds) {
      consecutiveDistractions++;
      sendDistractionAlert(url, category, consecutiveDistractions);
      return true;
    }
  } else if (category === 'focus' || category === 'productive') {
    // Reset consecutive distractions when back on track
    consecutiveDistractions = 0;
  }

  return false;
}

// Send distraction notification
function sendDistractionAlert(url, category, consecutiveCount) {
  if (!settings.enableNotifications) return;

  warningCount++;

  const messages = [
    "Hey! Looks like you're getting distracted. Time to refocus! 🎯",
    "You've wandered off track. Let's get back to work! 💪",
    "Distraction detected! Remember your goals. 🚀",
    "Taking a break? Make sure it's intentional! ⏰",
    "Focus time! Close this tab and get back on track. 🧘"
  ];

  const escalatedMessages = [
    "You've been distracted multiple times. Take a real break or refocus! ⚠️",
    "Seriously, this is your " + consecutiveCount + "th distraction. Time to lock in! 🔒",
    "Pattern detected: You keep getting pulled away. What's your priority right now? 🤔"
  ];

  let message = messages[warningCount % messages.length];
  if (consecutiveCount > 2) {
    message = escalatedMessages[(consecutiveCount - 3) % escalatedMessages.length];
  }

  browser.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-96.png',
    title: 'AI Focus Agent Alert',
    message: message
  });

  // Update badge
  browser.browserAction.setBadgeText({ text: warningCount.toString() });
  browser.browserAction.setBadgeBackgroundColor({ color: '#FF6B6B' });
}

// Monitor tab changes
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);

  if (currentTab && currentTab.url) {
    const timeOnSite = Date.now() - currentSiteStartTime;
    checkForDistraction(currentTab.url, timeOnSite);
  }

  trackSiteTime(tab.url);
});

// Monitor URL changes in current tab
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (currentTab && currentTab.url) {
      const timeOnSite = Date.now() - currentSiteStartTime;
      checkForDistraction(currentTab.url, timeOnSite);
    }

    trackSiteTime(changeInfo.url);
  }
});

// Periodic check (every 30 seconds)
browser.alarms.create('checkDistraction', { periodInMinutes: 0.5 });

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkDistraction' && currentTab && currentTab.url) {
    const timeOnSite = Date.now() - currentSiteStartTime;
    checkForDistraction(currentTab.url, timeOnSite);
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getStats') {
    sendResponse({
      siteVisits,
      warningCount,
      sessionStartTime,
      currentSite: currentTab ? currentTab.url : null,
      consecutiveDistractions
    });
  } else if (message.type === 'resetStats') {
    siteVisits = {};
    warningCount = 0;
    consecutiveDistractions = 0;
    sessionStartTime = Date.now();
    browser.browserAction.setBadgeText({ text: '' });
    sendResponse({ success: true });
  } else if (message.type === 'updateSettings') {
    settings = { ...settings, ...message.settings };
    browser.storage.local.set({ settings });
    sendResponse({ success: true });
  } else if (message.type === 'getSettings') {
    sendResponse({ settings });
  }

  return true; // Keep message channel open for async response
});

// Handle keyboard shortcuts
browser.commands.onCommand.addListener((command) => {
  if (command === 'toggle-focus-mode') {
    isInFocusMode = !isInFocusMode;

    const message = isInFocusMode
      ? 'Focus Mode ACTIVATED! 🎯 Stay on track!'
      : 'Focus Mode deactivated. Take a break if you need one.';

    browser.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-96.png',
      title: 'AI Focus Agent',
      message: message
    });

    // Update badge color based on mode
    if (isInFocusMode) {
      browser.browserAction.setBadgeBackgroundColor({ color: '#48BB78' });
      browser.browserAction.setBadgeText({ text: 'ON' });
    } else {
      browser.browserAction.setBadgeText({ text: warningCount > 0 ? warningCount.toString() : '' });
      browser.browserAction.setBadgeBackgroundColor({ color: '#FF6B6B' });
    }
  } else if (command === 'reset-session') {
    // Reset session stats
    siteVisits = {};
    warningCount = 0;
    consecutiveDistractions = 0;
    sessionStartTime = Date.now();
    browser.browserAction.setBadgeText({ text: '' });

    browser.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-96.png',
      title: 'Session Reset',
      message: 'Your focus session has been reset. Fresh start! 🚀'
    });
  } else if (command === 'open-popup') {
    browser.browserAction.openPopup();
  }
});

// Initialize on startup
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  if (tabs[0]) {
    currentTab = tabs[0];
    currentSiteStartTime = Date.now();
  }
});

console.log('AI Focus Agent initialized');
