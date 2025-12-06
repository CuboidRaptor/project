chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked', tab);
});

// Listen for keyboard command (Alt+R) defined in `manifest.json` under `commands`.
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'run-script') {
    // Inject `content.js` into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || !tab.id) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to inject content script:', chrome.runtime.lastError);
          } else {
            console.log('Injected content.js via command');
          }
        }
      );
    });
  }
});