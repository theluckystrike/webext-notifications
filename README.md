[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions)
[![npm](https://img.shields.io/npm/v/@zovo/webext-notifications)](https://www.npmjs.com/package/@zovo/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dt/@zovo/webext-notifications)](https://www.npmjs.com/package/@zovo/webext-notifications)

# webext-notifications

<p align="center">
  <strong>Typed notification wrapper with click handlers and button actions for Chrome extensions</strong>
</p>

Part of the [@zovo/webext](https://github.com/theluckystrike/webext) ecosystem — a collection of type-safe utilities for building Chrome extensions.

## Features

- **🔔 Full TypeScript Support** — Complete type definitions for all notification options
- **👆 Click Handlers** — Built-in support for notification click, button click, and close events
- **🔘 Button Actions** — Add interactive buttons with callback handlers
- **📊 Progress Notifications** — Display download/upload progress with real-time updates
- **⏱️ Auto-dismiss** — Notifications auto-close after a configurable timeout
- **🎨 Notification Templates** — Support for basic, image, list, and progress types
- **🧹 Automatic Cleanup** — Event handlers are automatically cleaned up when notifications close

## Install

```bash
npm install @zovo/webext-notifications
# or
pnpm add @zovo/webext-notifications
# or
yarn add @zovo/webext-notifications
```

## Quick Start

```typescript
import { notify, notifyBasic, notifyProgress, updateNotification, clearNotification } from "@zovo/webext-notifications";

// Basic notification with click handler
await notifyBasic("welcome", "Hello!", "Welcome to the extension", "icons/icon.png", {
  onClick: (id) => console.log("Notification clicked:", id),
  onClose: (id, byUser) => console.log("Closed by user:", byUser),
});
```

## Advanced Usage

### Full Notification with Buttons

```typescript
await notify(
  "update-available",
  {
    type: "basic",
    title: "New Update Available",
    message: "Version 2.0 is now available with new features",
    iconUrl: "icons/update.png",
    priority: 2,
    buttons: [
      { title: "Update Now" },
      { title: "Later" },
    ],
    requireInteraction: true,
  },
  {
    onButtonClick: (id, buttonIndex) => {
      if (buttonIndex === 0) {
        installUpdate();
      }
    },
    onClose: (id, byUser) => {
      console.log("User dismissed the update notification");
    },
  }
);
```

### Progress Notifications

```typescript
// Create progress notification
await notifyProgress(
  "download-file",
  "Downloading file.txt",
  "Starting download...",
  "icons/download.png",
  0
);

// Update progress
for (let i = 0; i <= 100; i += 10) {
  await updateNotification("download-file", {
    message: `${i}% complete`,
    progress: i,
  });
  await new Promise(r => setTimeout(r, 200));
}

// Clear when done
await clearNotification("download-file");
```

### Notification Queue

```typescript
const notificationQueue: Array<{title: string; message: string}> = [
  { title: "Task 1 Complete", message: "First task finished" },
  { title: "Task 2 Complete", message: "Second task finished" },
  { title: "Task 3 Complete", message: "Third task finished" },
];

for (const notification of notificationQueue) {
  await notifyBasic(
    `task-${Date.now()}`,
    notification.title,
    notification.message,
    "icons/check.png"
  );
  // Wait 3 seconds between notifications
  await new Promise(r => setTimeout(r, 3000));
}
```

### Deep Link via Query Parameters

```typescript
await notify(
  "open-dashboard",
  {
    type: "basic",
    title: "Dashboard Ready",
    message: "Click to view your dashboard",
    iconUrl: "icons/dashboard.png",
  },
  {
    onClick: (id) => {
      // Open dashboard with deep link
      chrome.tabs.create({
        url: "popup.html#/dashboard?highlight=new-features",
      });
    },
  }
);
```

### List Notifications

```typescript
await notify(
  "new-emails",
  {
    type: "list",
    title: "New Emails",
    message: "3 unread messages",
    iconUrl: "icons/email.png",
    items: [
      { title: "Alice", message: "Meeting at 3pm" },
      { title: "Bob", message: "Project update" },
      { title: "Charlie", message: "Lunch?" },
    ],
  }
);
```

## API Reference

### `notify(id, options, handlers?)`

Creates a notification with full options.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the notification |
| `options` | `NotifyOptions` | Full notification configuration |
| `handlers` | `Partial<HandlerSet>` | Event handlers (optional) |

Returns: `Promise<string>` — Resolves with the notification ID

### `notifyBasic(id, title, message, iconUrl, handlers?)`

Shorthand for basic text notifications.

```typescript
await notifyBasic("id", "Title", "Message", "icon.png", { onClick: ... })
```

Returns: `Promise<string>`

### `notifyProgress(id, title, message, iconUrl, progress)`

Creates a progress notification (0-100).

```typescript
await notifyProgress("download", "Downloading", "50% complete", "icon.png", 50)
```

Returns: `Promise<string>`

### `updateNotification(id, options)`

Update an existing notification.

```typescript
await updateNotification("download", { progress: 75, message: "75% complete" })
```

Returns: `Promise<boolean>`

### `clearNotification(id)`

Clear a notification.

```typescript
await clearNotification("download")
```

Returns: `Promise<boolean>`

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Fired when the notification body is clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Fired when a button is clicked |
| `onClose` | `(id: string, byUser: boolean) => void` | Fired when the notification closes |

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

### Chrome vs Edge

- Both Chrome and Edge support the full notifications API
- Button icons require Chrome 32+ and may not appear in all browsers
- `requireInteraction` is supported in Chrome and Edge

### Firefox

- Firefox has limited notification support
- Buttons are not fully supported in Firefox
- Some options like `imageUrl` may have limited support

### OS-Specific Behavior

- **Windows**: Notifications appear in the Action Center
- **macOS**: Notifications appear in Notification Center
- **Linux**: Notification behavior varies by desktop environment (GNOME, KDE, etc.)

## Related Packages

- [@zovo/webext](https://github.com/theluckystrike/webext) — Core types and utilities
- [@zovo/webext-storage](https://github.com/theluckystrike/webext-storage) — Typed storage wrapper
- [@zovo/webext-tabs](https://github.com/theluckystrike/webext-tabs) — Tab management utilities
- [@zovo/webext-messaging](https://github.com/theluckystrike/webext-messaging) — Type-safe message passing

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/theluckystrike">theluckystrike</a> — <a href="https://zovo.one">zovo.one</a>
</p>
