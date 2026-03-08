[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dt/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)

# webext-notifications

A type-safe TypeScript wrapper for the Chrome Notifications API with built-in event handling. Simplifies creating, updating, and managing notifications in Chrome extensions with full TypeScript support and promise-based API.

Part of the [chrome-extension-guide](https://github.com/theluckystrike/chrome-extension-guide) ecosystem — a comprehensive collection of TypeScript packages for building modern Chrome extensions.

---

## Features

- **🚀 Type-Safe** — Full TypeScript support with comprehensive type definitions
- **⚡ Promise-Based** — Modern async/await API for all notification operations
- **🖱️ Event Handling** — Built-in support for click, button click, and close events
- **📊 Progress Notifications** — Native progress bar support for downloads/tasks
- **🔄 Updates & Cleanup** — Easily update or clear existing notifications
- **🧹 Automatic Cleanup** — Event handlers are automatically cleaned up when notifications close
- **🎯 Multiple Types** — Support for basic, image, list, and progress notification types

---

## Install

```bash
npm install @theluckystrike/webext-notifications
```

Or with yarn:

```bash
yarn add @theluckystrike/webext-notifications
```

Or with pnpm:

```bash
pnpm add @theluckystrike/webext-notifications
```

---

## Quick Start

```typescript
import { notifyBasic } from "@theluckystrike/webext-notifications";

// Create a simple notification with click handler
await notifyBasic("welcome", "Hello!", "Welcome to my extension", "/icons/icon.png", {
  onClick: (id) => console.log(`Notification ${id} was clicked!`),
  onClose: (id, byUser) => console.log(`Notification ${id} closed by user: ${byUser}`),
});
```

That's it! The notification will appear and your handlers will be automatically registered.

---

## API Reference

### `notify(id, options, eventHandlers?)`

Creates a notification with full options and optional event handlers.

```typescript
const id = await notify("notification-id", {
  type: "basic",
  title: "New Message",
  message: "You have 3 new messages",
  iconUrl: "/icons/message.png",
  contextMessage: "from: john@example.com",
  priority: 1,
  silent: false,
  requireInteraction: false,
}, {
  onClick: (id) => openMessages(),
  onButtonClick: (id, buttonIndex) => handleButton(id, buttonIndex),
  onClose: (id, byUser) => cleanup(id),
});
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the notification |
| `options` | `NotifyOptions` | Notification configuration options |
| `eventHandlers?` | `Partial<HandlerSet>` | Optional event handlers |

**Returns:** `Promise<string>` — Resolves to the notification ID

---

### `notifyBasic(id, title, message, iconUrl, eventHandlers?)`

Shorthand function for creating basic text notifications.

```typescript
await notifyBasic("welcome", "Welcome!", "Thanks for installing", "/icons/icon.png", {
  onClick: (id) => openWelcomeScreen(),
});
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the notification |
| `title` | `string` | Notification title (required) |
| `message` | `string` | Notification message body |
| `iconUrl` | `string` | Path to notification icon |
| `eventHandlers?` | `Partial<HandlerSet>` | Optional event handlers |

**Returns:** `Promise<string>` — Resolves to the notification ID

---

### `notifyProgress(id, title, message, iconUrl, progress)`

Creates a progress notification to show task completion status.

```typescript
// Show 50% progress
await notifyProgress("download", "Downloading file", "50% complete", "/icons/download.png", 50);

// Update to 75%
await updateNotification("download", { progress: 75 });

// Complete
await updateNotification("download", { title: "Download complete!", progress: 100 });
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the notification |
| `title` | `string` | Notification title |
| `message` | `string` | Status message |
| `iconUrl` | `string` | Path to icon |
| `progress` | `number` | Progress value 0-100 |

**Returns:** `Promise<string>` — Resolves to the notification ID

---

### `updateNotification(id, options)`

Updates an existing notification with new content.

```typescript
// Update progress
await updateNotification("download", { progress: 75 });

// Update title and message
await updateNotification("status", { title: "Processing...", message: "Almost done" });

// Add buttons to existing notification
await updateNotification("action", { buttons: [{ title: "View" }, { title: "Dismiss" }] });
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | ID of the notification to update |
| `options` | `Partial<NotifyOptions>` | New options to apply |

**Returns:** `Promise<boolean>` — `true` if successfully updated

---

### `clearNotification(id)`

Clears/removes a notification from the notification center.

```typescript
await clearNotification("download");

// Check result
const wasCleared = await clearNotification("notification-id");
if (wasCleared) {
  console.log("Notification cleared successfully");
}
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | ID of the notification to clear |

**Returns:** `Promise<boolean>` — `true` if successfully cleared

---

### `clearAllHandlers()`

Manually clears all registered event handlers. Typically used in testing or when unloading the extension.

```typescript
clearAllHandlers();
```

---

## Notification Options

Full options object passed to `notify()`:

```typescript
interface NotifyOptions {
  type: NotificationType;           // "basic" | "image" | "list" | "progress"
  title: string;                     // Notification title
  message: string;                   // Message body
  iconUrl: string;                   // Icon path (required)
  contextMessage?: string;           // Secondary text below message
  priority?: 0 | 1 | 2;              // Priority level (0=normal, 2=high)
  buttons?: NotificationButton[];    // Action buttons
  imageUrl?: string;                 // Image for "image" type
  items?: NotificationItem[];        // List items for "list" type
  progress?: number;                 // Progress 0-100 for "progress" type
  silent?: boolean;                  // Suppress sound
  requireInteraction?: boolean;      // Keep until user interacts
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

---

## Event Handlers

### `onClick`

Called when the user clicks the notification body (not a button).

```typescript
await notify("my-notification", {...}, {
  onClick: (id) => {
    console.log(`User clicked notification: ${id}`);
    // Open extension page, focus window, etc.
  },
});
```

### `onButtonClick`

Called when the user clicks a button on the notification.

```typescript
await notify("action", {
  type: "basic",
  title: "Update Available",
  message: "Version 2.0 is ready",
  iconUrl: "/icons/update.png",
  buttons: [
    { title: "Update Now" },
    { title: "Later" },
    { title: "Skip" },
  ],
}, {
  onButtonClick: (id, buttonIndex) => {
    switch (buttonIndex) {
      case 0: installUpdate(); break;
      case 1: snoozeUpdate(); break;
      case 2: skipUpdate(); break;
    }
  },
});
```

### `onClose`

Called when the notification is closed (either by user or programmatically).

```typescript
await notify("temp", {...}, {
  onClose: (id, byUser) => {
    console.log(`Notification ${id} closed. By user: ${byUser}`);
    // Cleanup resources, remove from tracking, etc.
  },
});
```

**Handler Signature Summary:**

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Triggered when notification body is clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Triggered when a button is clicked |
| `onClose` | `(id: string, byUser: boolean) => void` | Triggered when notification closes |

---

## Complete Examples

### Download Progress Tracker

```typescript
import { notifyProgress, updateNotification, clearNotification } from "@theluckystrike/webext-notifications";

async function trackDownload(fileName: string) {
  const notificationId = `download-${fileName}`;
  
  // Start progress notification
  await notifyProgress(
    notificationId,
    "Downloading",
    `Starting download: ${fileName}`,
    "/icons/download.png",
    0
  );

  // Simulate progress updates
  for (let progress = 0; progress <= 100; progress += 10) {
    await updateNotification(notificationId, {
      progress,
      message: `${progress}% complete`,
    });
    await new Promise(r => setTimeout(r, 500));
  }

  // Complete
  await updateNotification(notificationId, {
    title: "Download Complete",
    message: `${fileName} is ready`,
    progress: undefined, // Remove progress bar
  });

  // Clear after delay
  setTimeout(() => clearNotification(notificationId), 5000);
}
```

### Multi-Action Notification

```typescript
import { notify } from "@theluckystrike/webext-notifications";

await notify("new-friend", {
  type: "basic",
  title: "New Friend Request",
  message: "John Doe wants to connect",
  iconUrl: "/icons/friends.png",
  contextMessage: " mutual friends",
  priority: 1,
  buttons: [
    { title: "Accept" },
    { title: "Decline" },
    { title: "Block" },
  ],
  requireInteraction: true,
}, {
  onButtonClick: async (id, buttonIndex) => {
    switch (buttonIndex) {
      case 0: // Accept
        await acceptFriendRequest();
        break;
      case 1: // Decline
        await declineFriendRequest();
        break;
      case 2: // Block
        await blockUser();
        break;
    }
    await clearNotification(id);
  },
  onClick: (id) => {
    // Open full profile when clicking notification body
    chrome.tabs.create({ url: "/profile.html" });
  },
});
```

### Silent Notification with Auto-Clear

```typescript
import { notifyBasic, clearNotification } from "@theluckystrike/webext-notifications";

// Silent notification - no sound
await notifyBasic("info", "Background Task Complete", "Data synced successfully", "/icons/sync.png", {
  silent: true,
  onClose: async (id) => {
    // Could save state or update badge
    console.log(`Notification ${id} was dismissed`);
  },
});

// Auto-clear after 3 seconds
setTimeout(() => clearNotification("info"), 3000);
```

---

## Chrome Extension Manifest

Ensure you have the required permissions in your `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "notifications"
  ],
  "icons": {
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

**Note:** For MV3 (Manifest V3), notifications work automatically in background scripts and popup/context menu actions. For content scripts, use message passing to communicate with the service worker.

---

## Related Packages

This package is part of the **chrome-extension-guide** ecosystem:

- [chrome-extension-guide](https://github.com/theluckystrike/chrome-extension-guide) — Monorepo with all packages
- [@theluckystrike/webext-storage](https://github.com/theluckystrike/webext-storage) — Type-safe storage wrapper
- [@theluckystrike/webext-tabs](https://github.com/theluckystrike/webext-tabs) — Tab management utilities
- [@theluckystrike/webext-messaging](https://github.com/theluckystrike/webext-messaging) — Type-safe message passing

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full (Chromium) |
| Opera | ✅ Full (Chromium) |
| Brave | ✅ Full |
| Firefox | ⚠️ Uses Web Notifications API (different API) |

This package targets Chrome's `chrome.notifications` API. For Firefox, consider using the Web Notifications API directly or the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill).

---

## License

MIT © [theluckystrike](https://github.com/theluckystrike)

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)

</div>
