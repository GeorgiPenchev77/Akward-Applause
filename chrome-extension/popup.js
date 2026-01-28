// Load and display clipboard history
function loadHistory() {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (response) => {
    const history = response.history || [];
    const container = document.getElementById('historyContainer');
    
    if (history.length === 0) {
      container.innerHTML = '<p class="empty-state">No items saved yet. Select text and press Cmd+K to save!</p>';
      return;
    }
    
    container.innerHTML = '';
    
    history.forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      const date = new Date(entry.timestamp);
      const timeStr = date.toLocaleTimeString();
      const dateStr = date.toLocaleDateString();
      
      item.innerHTML = `
        <div class="item-content">
          <div class="item-text">${escapeHtml(entry.text)}</div>
          <div class="item-meta">
            <span class="item-time">${dateStr} at ${timeStr}</span>
            <span class="item-source" title="${escapeHtml(entry.source)}">📄 ${escapeHtml(entry.source)}</span>
          </div>
        </div>
        <button class="btn-copy" data-id="${entry.id}">Copy</button>
        <button class="btn-delete" data-id="${entry.id}">Delete</button>
      `;
      
      container.appendChild(item);
      
      // Copy button handler
      item.querySelector('.btn-copy').addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(entry.text).then(() => {
          const btn = e.target;
          const originalText = btn.textContent;
          btn.textContent = '✓ Copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        });
      });
      
      // Delete button handler
      item.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.runtime.sendMessage(
          { action: 'deleteEntry', id: entry.id },
          () => {
            loadHistory();
          }
        );
      });
    });
  });
}

// Clear all history
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all clipboard history?')) {
    chrome.runtime.sendMessage({ action: 'clearHistory' }, () => {
      loadHistory();
    });
  }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Load history on popup open
loadHistory();

// Reload history every 2 seconds to stay in sync
setInterval(loadHistory, 2000);
