[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-notifications

> Typed notification wrapper with click handlers and button actions for Chrome extensions. Part of @zovo/webext.

A type-safe, promise-based notification library for Chrome extensions with full support for click handlers, button actions, progress bars, and more.

## Features

- **🔔 Create Notifications** — Basic, image, list, and progress notifications with full type safety
- **👆 Click Handlers** — Handle notification clicks, button clicks, and close events
- **🔘 Button Actions** — Add up to 2 action buttons with custom handlers
- **📊 Progress Bars** — Show download/upload progress with dynamic updates
- **⏱️ Auto-dismiss** — Automatic dismissal after a configurable duration
- **📋 Templates** — Reusable notification patterns for common use cases

## Install

```bash
npm install @theluckystrike/webext-notifications
# or
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
    onClose: (id, byUser) => console.log("Closed:", id, byUser),
  }
);

// Full-featured notification with buttons
await notify(
  "update-available",
  {
    type: "basic",
    title: "New Update",
    message: "Version 2.0 is available with new features",
    iconUrl: "icons/update.png",
    priority: 1,
    buttons: [
      { title: "Update Now" },
      { title: "Later" }
    ],
    requireInteraction: true,
  },
  {
    onButtonClick: (id, index) => {
      if (index === 0) {
        // User clicked "Update Now"
        installUpdate();
      }
    },
    onClose: (id, byUser) => {
      if (!byUser) console.log("Auto-dismissed");
    }
  }
);
```

## Advanced Usage

### Progress Notifications

```typescript
// Create progress notification
await notifyProgress(
  "download",
  "Downloading file...",
  "Please wait",
  "icons/download.png",
  0 // Start at 0%
);

// Update progress dynamically
for (let i = 0; i <= 100; i += 10) {
  await updateNotification("download", {
    message: `${i}% complete`,
    progress: i
  });
}

// Mark as complete
await updateNotification("download", {
  title: "Download Complete",
  message: "File saved to downloads folder",
  progress: -1 // -1 removes the progress bar
});
```

### Notification Queue Pattern

```typescript
class NotificationQueue {
  private queue: Array<{ title: string; message: string }> = [];
  private currentId: string | null = null;

  async enqueue(title: string, message: string) {
    this.queue.push({ title, message });
    if (!this.currentId) this.processNext();
  }

  private async processNext() {
    if (this.queue.length === 0) {
      this.currentId = null;
      return;
    }

    const notification = this.queue.shift()!;
    this.currentId = "queue-" + Date.now();

    await notifyBasic(
      this.currentId,
      notification.title,
      notification.message,
      "icons/info.png",
      {
        onClose: () => this.processNext()
      }
    );
  }
}
```

### Deep-Link Style Notifications

```typescript
// Use notification ID as a routing mechanism
await notify(
  "open-dashboard",
  {
    type: "basic",
    title: "Task Complete",
    message: "Click to view your dashboard",
    iconUrl: "icons/check.png",
    buttons: [
      { title: "View Details" },
      { title: "Dismiss" }
    ]
  },
  {
    onClick: (id) => {
      // Navigate to dashboard
      chrome.tabs.create({ url: "dashboard.html" });
    },
    onButtonClick: (id, index) => {
      if (index === 0) {
        chrome.tabs.create({ url: "details.html" });
      }
    }
  }
);
```

### Grouped Notifications

```typescript
// Create a visual group using similar prefixes
await notify(
  "email-unread-1",
  { type: "list", title: "New Emails", message: "3 unread", items: [
    { title: "From: Alice", message: "Meeting tomorrow" },
    { title: "From: Bob", message: "Project update" },
    { title: "From: Carol", message: "Re: Report" }
  ]}
);
```

## API Reference

### Core Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `notify(id, options, handlers?)` | Create a notification with full options | `Promise<string>` |
| `notifyBasic(id, title, message, iconUrl, handlers?)` | Shorthand for basic text notifications | `Promise<string>` |
| `notifyProgress(id, title, message, iconUrl, progress)` | Create a progress notification (0-100) | `Promise<string>` |
| `updateNotification(id, options)` | Update an existing notification | `Promise<boolean>` |
| `clearNotification(id)` | Clear a notification | `Promise<boolean>` |

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Notification body clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Button clicked (index: 0 or 1) |
| `onClose` | `(id: string, byUser: boolean) => void` | Notification closed (byUser: true if user dismissed) |

### Notification Types

```typescript
type NotificationType = "basic" | "image" | "list" | "progress";
```

### NotifyOptions

```typescript
interface NotifyOptions {
  type: NotificationType;
  title: string;
  message: string;
  iconUrl: string;
  contextMessage?: string;      // Secondary text below message
  priority?: 0 | 1 | 2;         // Priority level
  buttons?: NotificationButton[];
  imageUrl?: string;             // For "image" type
  items?: NotificationItem[];   // For "list" type
  progress?: number;             // 0-100 for progress, -1 to hide
  silent?: boolean;             // Mute notification sound
  requireInteraction?: boolean; // Keep visible until dismissed
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

For full functionality, you may also need:

```json
{
  "permissions": [
    "notifications",
    "tabs"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}
```

## Platform Notes

### Chrome / Chromium-based Browsers (Edge, Brave, etc.)

- Full support for all notification types
- Button support (max 2 buttons)
- Progress bars supported
- `requireInteraction` works as expected
- Notification sounds can be silenced with `silent: true`

### Firefox

- Similar API but some differences:
  - Button icons (`iconUrl`) are not supported
  - Progress notifications work differently
  - `requireInteraction` has limited support
- Check [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications) for latest compatibility

### Edge (Chromium)

- Full Chrome compatibility

### Opera

- Full Chrome compatibility

## Part of @zovo/webext

This library is part of the @zovo/webext ecosystem — a collection of type-safe utilities for Chrome extension development.

```bash
# Other packages in the ecosystem
npm install @zovo/webext-storage    # Typed storage wrapper
npm install @zovo/webext-tabs       # Tab management utilities
npm install @zovo/webext-messaging  # Cross-context messaging
```

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)

<a href="https://zovo.one">
  <img src="https://zovo.one/logo.svg" alt="Zovo" width="32" height="32" />
</a>
