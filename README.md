[![npm](https://img.shields.io/npm/v/webext-notifications)](https://www.npmjs.com/package/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-notifications

Typed notification wrapper with click handlers for Chrome extensions.

Part of the [chrome-extension-guide](https://github.com/niceByte/chrome-extension-guide) ecosystem.

## Install

```bash
npm install webext-notifications
```

## Usage

```typescript
import { notify, notifyBasic, notifyProgress, updateNotification, clearNotification } from "webext-notifications";

// Basic notification with click handler
await notifyBasic("welcome", "Hello!", "Welcome to the extension", "icons/icon.png", {
  onClick: (id) => console.log("Clicked:", id),
  onClose: (id, byUser) => console.log("Closed:", id, byUser),
});

// Full notification with buttons
await notify(
  "action",
  {
    type: "basic",
    title: "New Update",
    message: "Version 2.0 is available",
    iconUrl: "icons/update.png",
    buttons: [{ title: "Update Now" }, { title: "Later" }],
    requireInteraction: true,
  },
  {
    onButtonClick: (id, index) => {
      if (index === 0) installUpdate();
    },
  }
);

// Progress notification
await notifyProgress("download", "Downloading", "50% complete", "icons/dl.png", 50);

// Update existing notification
await updateNotification("download", { title: "Almost done", progress: 90 });

// Clear notification
await clearNotification("download");
```

## API

### `notify(id, options, handlers?)`

Create a notification with full options.

### `notifyBasic(id, title, message, iconUrl, handlers?)`

Shorthand for basic text notifications.

### `notifyProgress(id, title, message, iconUrl, progress)`

Create a progress notification (0-100).

### `updateNotification(id, options)`

Update an existing notification. Returns `Promise<boolean>`.

### `clearNotification(id)`

Clear a notification. Returns `Promise<boolean>`.

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Notification body clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Button clicked |
| `onClose` | `(id: string, byUser: boolean) => void` | Notification closed |

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
