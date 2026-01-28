# Awkward Applause - Text Clipper Chrome Extension

A simple Chrome extension that saves selected text to clipboard history when you press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux).

## Features

✨ **Quick Save**: Select any text on a webpage and press Cmd+K to save it
📋 **Clipboard History**: View all saved text snippets in a popup window
📋 **One-Click Copy**: Copy any saved text back to your clipboard with a single click
🗑️ **Delete Entries**: Remove individual items or clear entire history
📍 **Source Tracking**: See which page each text was saved from
⏰ **Timestamps**: Know exactly when you saved each snippet

## Installation

### For Developers (Development Mode)

1. Download or clone this folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top-right corner)
4. Click "Load unpacked"
5. Select the `chrome-extension` folder
6. The extension should now appear in your Chrome toolbar!

### For Users (After Publishing)

Once published to the Chrome Web Store, users can simply:
1. Visit the Chrome Web Store
2. Search for "Awkward Applause - Text Clipper"
3. Click "Add to Chrome"
4. Confirm the permissions

## Usage

1. **Save Text**: Select any text on a webpage → Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux)
2. **View Saved Items**: Click the extension icon in your Chrome toolbar to see the popup
3. **Copy**: Click the "Copy" button on any item to copy it to your clipboard
4. **Delete**: Click the "Delete" button to remove a specific item
5. **Clear All**: Click the trash icon to clear all history (with confirmation)

## Files Explained

- **manifest.json**: Extension configuration and permissions
- **content.js**: Listens for Cmd+K keypresses on web pages and captures selected text
- **background.js**: Manages clipboard history storage and synchronization
- **popup.html/css/js**: The UI popup window for viewing and managing history

## Permissions

- `storage`: To save clipboard history locally
- `clipboardWrite/clipboardRead`: To copy text to your clipboard
- `<all_urls>`: To work on any webpage

## Limitations

- Chrome extensions cannot access clipboard history across different extensions
- History is stored locally in your browser and will be cleared if you clear extension data
- Maximum 100 items are stored to manage extension storage efficiently

## Support

For issues or feature requests, please visit the GitHub repository.

## License

See LICENSE file for details.
