module.exports = {
  // Global options
  ignoreFiles: [
    'web-ext-config.js',
    'package.json',
    'package-lock.json',
    '.git',
    '.gitignore',
    'node_modules',
    'test',
    '*.md',
    '*.log'
  ],

  // Command-specific options
  build: {
    overwriteDest: true,
  },

  run: {
    startUrl: ['about:debugging#/runtime/this-firefox'],
    pref: [
      'devtools.debugger.remote-enabled=true',
      'devtools.chrome.enabled=true',
      'devtools.debugger.prompt-connection=false'
    ]
  },

  lint: {
    output: 'text',
    selfHosted: true,
    warningsAsErrors: false
  }
};
