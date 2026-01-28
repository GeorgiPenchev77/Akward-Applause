// Handle incoming messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeText') {
    // Retrieve existing clipboard history
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      let history = result.clipboardHistory || [];
      
      // Create new entry
      const entry = {
        id: Date.now(),
        text: request.text,
        timestamp: request.timestamp,
        source: request.source
      };
      
      // Add to beginning of history
      history.unshift(entry);
      
      // Keep only last 100 items (optional limit)
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
      
      // Save updated history
      chrome.storage.local.set({ clipboardHistory: history }, () => {
        // Copy to actual clipboard
        navigator.clipboard.writeText(request.text).then(() => {
          console.log('Text saved and copied to clipboard:', request.text);
          sendResponse({ success: true, message: 'Text saved successfully' });
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
          sendResponse({ success: false, message: 'Failed to copy to clipboard' });
        });
      });
    });
    
    // Return true to indicate we'll send response asynchronously
    return true;
  }
  
  if (request.action === 'getHistory') {
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      sendResponse({ history: result.clipboardHistory || [] });
    });
    return true;
  }
  
  if (request.action === 'deleteEntry') {
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      let history = result.clipboardHistory || [];
      history = history.filter(entry => entry.id !== request.id);
      chrome.storage.local.set({ clipboardHistory: history }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
  
  if (request.action === 'clearHistory') {
    chrome.storage.local.set({ clipboardHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
