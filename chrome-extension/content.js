// Listen for Cmd+K (or Ctrl+K on non-Mac) key press
document.addEventListener('keydown', (event) => {
  // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isCommandOrCtrlPressed = isMac ? event.metaKey : event.ctrlKey;
  const isKPressed = event.key.toLowerCase() === 'k';

  if (isCommandOrCtrlPressed && isKPressed) {
    event.preventDefault();
    
    // Get selected text
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
      // Send message to background script to store the text
      chrome.runtime.sendMessage(
        {
          action: 'storeText',
          text: selectedText,
          timestamp: new Date().toISOString(),
          source: window.location.href
        },
        (response) => {
          // Show visual feedback
          showNotification('Text saved to clipboard history!');
        }
      );
    } else {
      showNotification('No text selected. Please select text first.');
    }
  }
});

// Visual notification function
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-in-out;
  `;
  
  document.body.appendChild(notification);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-in-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
