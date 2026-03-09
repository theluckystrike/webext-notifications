[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![npm Downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)

# webext-notifications

> Typed notification wrapper with click handlers and button actions for Chrome extensions. Part of @zovo/webext.

A type-safe, Promise-based wrapper around Chrome's Notifications API that makes building rich, interactive notifications simple and enjoyable.

## Features

- 🎯 **Type-safe** — Full TypeScript support with comprehensive types
- 👆 **Click Handlers** — Handle notification clicks with typed callbacks
- 🔘 **Button Actions** — Add interactive buttons with per-button handlers
- 📊 **Progress Notifications** — Show download/upload progress natively
- ⏱️ **Auto-dismiss** — Configurable notification lifetime
- 📝 **Templates** — Quick helpers for common notification types
- 🔄 **Queue Support** — Manage multiple notifications easily
- 🎨 **Rich Media** — Support for images, icons, and list items

## Install

```bash
npm install @theluckystrike/webext-notifications
```

or with pnpm:

```bash
pnpm add @theluckystrike/webext-notifications
```

## Quick Start

```typescript
import { notifyBasic, notify, notifyProgress, updateNotification, clearNotification } from "@theluckystrike/webext-notifications";

// Simple notification with click handler
await notifyBasic(
  "welcome",
  "Hello!",
  "Welcome to the extension",
  "icons/icon.png",
  {
    onClick: (id) => console.log("Notification clicked:", id),
    onClose: (id, byUser) => console.log("Closed by user:", byUser),
  }
);
```

## Advanced Usage

### Notifications with Buttons

```typescript
await notify(
  "update-available",
  {
    type: "basic",
    title: "New Update Available",
    message: "Version 2.0 is ready to install",
    iconUrl: "icons/update.png",
    buttons: [
      { title: "Update Now", iconUrl: "icons/download.png" },
      { title: "Later" }
    ],
    requireInteraction: true,
  },
  {
    onButtonClick: (id, index) => {
      if (index === 0) {
        installUpdate();
      }
    },
    onClose: (id, byUser) => {
      if (!byUser) {
        // Auto-closed after update installed
      }
    }
  }
);
```

### Progress Notifications

```typescript
// Create a progress notification
const notificationId = await notifyProgress(
  "download",
  "Downloading File",
  "Please wait...",
  "icons/download.png",
  0
);

// Update progress
await updateNotification("download", {
  title: "Downloading File",
  message: "50% complete",
  progress: 50
});

// Complete the download
await updateNotification("download", {
  title: "Download Complete",
  message: "File saved to Downloads folder",
  progress: 100
});

// Auto-clear after a delay
setTimeout(() => clearNotification("download"), 3000);
```

### Notification Queues

```typescript
import { notify } from "@theluckystrike/webext-notifications";

const notificationQueue = [
  { id: "msg1", title: "New Message", message: "From: Alice" },
  { id: "msg2", title: "New Message", message: "From: Bob" },
  { id: "msg3", title: "New Message", message: "From: Charlie" },
];

// Show notifications with a delay between each
for (const msg of notificationQueue) {
  await notify(msg.id, {
    type: "basic",
    title: msg.title,
    message: msg.message,
    iconUrl: "icons/message.png",
    silent: false,
  });
  await new Promise(r => setTimeout(r, 2000));
}
```

### Deep-link via Notification Data

```typescript
await notify(
  "open-settings",
  {
    type: "basic",
    title: "Settings Updated",
    message: "Click to view your preferences",
    iconUrl: "icons/settings.png",
  },
  {
    onClick: (id) => {
      // Navigate to settings page
      chrome.runtime.sendMessage({ action: "openSettings", section: "general" });
    }
  }
);
```

### Grouped Notifications

```typescript
// Use notification ID to group related updates
await notify("build-status", {
  type: "basic",
  title: "CI Build #123",
  message: "Build started",
  iconUrl: "icons/ci.png",
});

// Later updates the same notification
await updateNotification("build-status", {
  title: "CI Build #123",
  message: "Running tests...",
  progress: 50,
});
```

## API Reference

### `notify(id, options, handlers?)`

Create a notification with full options.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the notification |
| `options` | `NotifyOptions` | Full notification configuration |
| `handlers` | `Partial<HandlerSet>` | Event handlers (optional) |

Returns: `Promise<string>` — Resolves with the notification ID

### `notifyBasic(id, title, message, iconUrl, handlers?)`

Shorthand for basic text notifications.

```typescript
await notifyBasic("welcome", "Hello!", "Welcome!", "icon.png");
```

### `notifyProgress(id, title, message, iconUrl, progress)`

Create or update a progress notification (0-100).

```typescript
await notifyProgress("download", "Downloading", "50%", "icon.png", 50);
```

### `updateNotification(id, options)`

Update an existing notification. Returns `Promise<boolean>`.

```typescript
await updateNotification("download", { progress: 75, message: "75% complete" });
```

### `clearNotification(id)`

Clear a notification. Returns `Promise<boolean>`.

```typescript
await clearNotification("download");
```

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Notification body clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Button clicked (index 0 = first button) |
| `onClose` | `(id: string, byUser: boolean) => void` | Notification closed (byUser=true if user dismissed) |

### TypeScript Types

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

For manifest V3, you may also need:

```json
{
  "permissions": [
    "notifications"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}
```

## Platform Notes

### Chrome (Desktop)
- Full support for all notification types
- Buttons work correctly
- Progress notifications supported
- Maximum 2 buttons per notification

### Firefox
- Similar to Chrome with some differences:
- `requireInteraction` may not be respected
- Image notifications have limited support
- Some button behaviors may vary

### Edge
- Full Chrome compatibility
- Uses Chromium underlying engine

### Safari (macOS)
- Uses native macOS notifications
- Limited button support
- Different icon requirements

## Part of @zovo/webext

This package is part of the @zovo/webext ecosystem — a collection of type-safe, promise-based wrappers for Chrome Extension APIs.

- [webext-events](https://github.com/theluckystrike/webext-events) — Typed event emitters
- [webext-storage](https://github.com/theluckystrike/webext-storage) — Promise-based storage API
- [webext-messaging](https://github.com/theluckystrike/webext-messaging) — Type-safe message passing

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
