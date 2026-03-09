[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dt/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)

# webext-notifications

Typed notification wrapper with click handlers and button actions for Chrome extensions. Part of [@zovo/webext](https://github.com/theluckystrike/webext).

## Features

- **🔔 Create Notifications** — Simple API for basic, image, list, and progress notifications
- **👆 Click Handlers** — Attach handlers for notification clicks, button clicks, and close events
- **🔘 Button Actions** — Add interactive buttons with custom click handlers
- **📊 Progress Bars** — Display download/upload progress with real-time updates
- **⏱️ Auto-dismiss** — Notifications automatically dismiss after display (configurable)
- **📋 Templates** — Pre-built notification templates for common use cases
- **🔄 Queue System** — Manage multiple notifications with automatic ID handling
- **🔗 Deep-link Support** — Navigate to specific extension pages from notifications
- **📦 Grouped Notifications** — Group related notifications for better UX

## Install

```bash
npm install @theluckystrike/webext-notifications
# or
pnpm add @theluckystrike/webext-notifications
# or
yarn add @theluckystrike/webext-notifications
```

## Quick Start

```typescript
import { notifyBasic, notify, notifyProgress, updateNotification, clearNotification } from "@theluckystrike/webext-notifications";

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

## Advanced Usage

### Progress Notifications

Track long-running operations with progress notifications:

```typescript
// Create initial progress notification
await notifyProgress("download", "Downloading", "Starting download...", "icons/download.png", 0);

// Simulate progress updates
for (let i = 0; i <= 100; i += 10) {
  await updateNotification("download", {
    progress: i,
    message: `${i}% complete`
  });
  await new Promise(r => setTimeout(r, 500));
}

// Complete
await updateNotification("download", {
  title: "Download Complete",
  message: "File saved to downloads folder",
  progress: undefined // Removes progress bar
});
```

### Notification Queue

Manage multiple notifications with automatic ID generation:

```typescript
// Queue multiple notifications
const ids = await Promise.all([
  notifyBasic("notif-1", "Task 1", "Completed successfully", "icons/check.png"),
  notifyBasic("notif-2", "Task 2", "Completed successfully", "icons/check.png"),
  notifyBasic("notif-3", "Task 3", "Completed successfully", "icons/check.png"),
]);

// Clear all
for (const id of ids) {
  await clearNotification(id);
}
```

### Deep-link Navigation

Open specific extension pages when users click notifications:

```typescript
await notifyBasic(
  "settings",
  "Settings Updated",
  "Your preferences have been saved",
  "icons/settings.png",
  {
    onClick: (id) => {
      // Open extension settings page
      chrome.runtime.openOptionsPage();
    }
  }
);
```

### Grouped Notifications

Group related notifications using the `chrome.notifications` API:

```typescript
await notify("group-download-1", {
  type: "basic",
  title: "Download 1",
  message: "file1.zip (50MB)",
  iconUrl: "icons/download.png",
  priority: 1,
});

await notify("group-download-2", {
  type: "basic",
  title: "Download 2",
  message: "file2.zip (25MB)",
  iconUrl: "icons/download.png",
  priority: 1,
});
```

## API Reference

### `notify(id, options, handlers?)`

Creates a notification with full options. Returns `Promise<string>` with the notification ID.

**Parameters:**
- `id: string` — Unique identifier for the notification
- `options: NotifyOptions` — Full notification configuration
- `handlers?: HandlerSet` — Optional event handlers

### `notifyBasic(id, title, message, iconUrl, handlers?)`

Shorthand for creating basic text notifications. Returns `Promise<string>`.

### `notifyProgress(id, title, message, iconUrl, progress)`

Creates a progress notification (0-100). Returns `Promise<string>`.

### `updateNotification(id, options)`

Updates an existing notification. Returns `Promise<boolean>`.

### `clearNotification(id)`

Clears a notification. Returns `Promise<boolean>`.

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Triggered when notification body is clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Triggered when a button is clicked |
| `onClose` | `(id: string, byUser: boolean) => void` | Triggered when notification is closed |

### Types

```typescript
type NotificationType = "basic" | "image" | "list" | "progress";

interface NotifyOptions {
  type: NotificationType;
  title: string;
  message: string;
  iconUrl: string;
  contextMessage?: string;
  priority?: 0 | 1 | 2;
  buttons?: NotificationButton[];
  imageUrl?: string;
  items?: NotificationItem[];
  progress?: number;
  silent?: boolean;
  requireInteraction?: boolean;
}

interface NotificationButton {
  title: string;
  iconUrl?: string;
}

interface NotificationItem {
  title: string;
  message: string;
}
```

## Permissions

Add the `notifications` permission to your `manifest.json`:

```json
{
  "permissions": [
    "notifications"
  ]
}
```

## Platform Notes

### Chrome / Chromium-based Browsers

Full support for all notification features including:
- Button actions
- Progress bars
- Rich media (image notifications)
- List notifications
- requireInteraction flag

### Firefox

Most features are supported with some differences:
- Button icons may not display
- Some notification types behave differently
- Check [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications) for details

### Edge

Full support similar to Chrome.

### Safari

Limited support. Safari uses macOS notification system which has different capabilities.

## Related

Part of the [@zovo/webext](https://github.com/theluckystrike/webext) ecosystem:

- [webext-storage](https://github.com/theluckystrike/webext-storage) — Typed storage wrapper
- [webext-tabs](https://github.com/theluckystrike/webext-tabs) — Tab management utilities
- [webext-messaging](https://github.com/theluckystrike/webext-messaging) — Cross-context messaging

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
