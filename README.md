[![CI](https://github.com/theluckystrike/webext-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-notifications/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-notifications

Typed notification wrapper with click handlers for Chrome extensions.

Part of the [Zovo WebExtension](https://github.com/theluckystrike) ecosystem — type-safe utilities for building modern Chrome extensions.

---

## Features

- 🔔 **Create notifications** — Simple API for basic, image, list, and progress notifications
- 🖱️ **Click handlers** — Handle notification clicks with typed callbacks
- 🔘 **Button actions** — Add interactive buttons with index-based click handlers
- 📊 **Progress notifications** — Display download/upload progress with real-time updates
- 🔄 **Update notifications** — Dynamically update title, message, and progress
- 🗑️ **Auto-cleanup** — Automatic handler cleanup when notifications close
- 📋 **Notification templates** — Reusable patterns for common notification types

---

## Install

```bash
npm install @theluckystrike/webext-notifications
```

Or with pnpm:

```bash
pnpm add @theluckystrike/webext-notifications
```

Or with yarn:

```bash
yarn add @theluckystrike/webext-notifications
```

---

## Quick Start

### Basic Notification

The simplest way to show a notification:

```typescript
import { notifyBasic } from "@theluckystrike/webext-notifications";

await notifyBasic(
  "welcome",
  "Hello!",
  "Welcome to your Chrome extension",
  "icons/notification.png"
);
```

### Notification with Click Handler

Handle when users click the notification body:

```typescript
import { notifyBasic } from "@theluckystrike/webext-notifications";

await notifyBasic(
  "welcome",
  "New Message",
  "You have a new message from John",
  "icons/message.png",
  {
    onClick: (id) => {
      console.log(`Notification ${id} clicked!`);
      // Open the messages panel
      chrome.tabs.create({ url: "messages.html" });
    },
    onClose: (id, byUser) => {
      console.log(`Notification ${id} closed by ${byUser ? "user" : "system"}`);
    }
  }
);
```

### Notification with Buttons

Add action buttons for richer interactivity:

```typescript
import { notify } from "@theluckystrike/webext-notifications";

await notify(
  "update-available",
  {
    type: "basic",
    title: "Update Available",
    message: "Version 2.0.0 is ready to install",
    iconUrl: "icons/update.png",
    buttons: [
      { title: "Update Now" },
      { title: "Later" },
      { title: "Skip This Version" }
    ]
  },
  {
    onButtonClick: (id, buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          installUpdate();
          break;
        case 1:
          scheduleUpdate();
          break;
        case 2:
          skipVersion();
          break;
      }
    }
  }
);
```

---

## Advanced Patterns

### Progress Notification

Track long-running operations with progress bars:

```typescript
import { notifyProgress, updateNotification, clearNotification } from "@theluckystrike/webext-notifications";

// Start a download
await notifyProgress(
  "download-123",
  "Downloading file...",
  "0% complete",
  "icons/download.png",
  0
);

// Simulate progress updates
for (let progress = 0; progress <= 100; progress += 10) {
  await updateNotification("download-123", {
    progress,
    message: `${progress}% complete`
  });
  
  await new Promise(resolve => setTimeout(resolve, 200));
}

// Clear when done
await clearNotification("download-123");
```

### Notification with Deep-Link

Open specific tabs or URLs when users interact with notifications:

```typescript
import { notifyBasic } from "@theluckystrike/webext-notifications";

await notifyBasic(
  "task-complete",
  "Download Complete",
  "report-2024.pdf (2.4 MB)",
  "icons/download.png",
  {
    onClick: async (id) => {
      // Find or create the downloads tab
      const tabs = await chrome.tabs.query({ url: "chrome://downloads/*" });
      
      if (tabs.length > 0) {
        await chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        await chrome.tabs.create({ url: "chrome://downloads/" });
      }
    }
  }
);
```

### Notification Queue

Manage multiple notifications without overwhelming the user:

```typescript
import { notifyBasic } from "@theluckystrike/webext-notifications";

class NotificationQueue {
  private queue: Array<{ id: string; title: string; message: string; iconUrl: string }> = [];
  private processing = false;

  async enqueue(id: string, title: string, message: string, iconUrl: string) {
    this.queue.push({ id, title, message, iconUrl });
    
    if (!this.processing) {
      this.process();
    }
  }

  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const notification = this.queue.shift()!;
      
      await notifyBasic(
        notification.id,
        notification.title,
        notification.message,
        notification.iconUrl
      );
      
      // Wait 3 seconds before showing next notification
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    this.processing = false;
  }
}

// Usage
const queue = new NotificationQueue();
queue.enqueue("msg-1", "New Message", "You have a new message", "icons/msg.png");
queue.enqueue("msg-2", "Another Message", "From: Jane", "icons/msg.png");
```

### Grouped Notifications

Use notification IDs with prefixes to group related notifications:

```typescript
import { notifyBasic, clearNotification } from "@theluckystrike/webext-notifications";

class NotificationGroup {
  private groupId: string;
  private notifications: string[] = [];

  constructor(groupId: string) {
    this.groupId = groupId;
  }

  async add(title: string, message: string, iconUrl: string) {
    const notificationId = `${this.groupId}-${this.notifications.length}`;
    this.notifications.push(notificationId);

    await notifyBasic(notificationId, title, message, iconUrl);
  }

  async clearAll() {
    for (const id of this.notifications) {
      await clearNotification(id);
    }
    this.notifications = [];
  }

  getCount() {
    return this.notifications.length;
  }
}

// Usage: Group related notifications
const downloadGroup = new NotificationGroup("downloads");
await downloadGroup.add("File 1 downloaded", "report.pdf", "icons/file.png");
await downloadGroup.add("File 2 downloaded", "data.csv", "icons/file.png");
await downloadGroup.add("File 3 downloaded", "image.jpg", "icons/file.png");

// Later, clear all at once
// await downloadGroup.clearAll();
```

### Auto-Dismiss Notification

Create a notification that automatically clears after a timeout:

```typescript
import { notifyBasic, clearNotification } from "@theluckystrike/webext-notifications";

async function notifyAutoDismiss(
  id: string,
  title: string,
  message: string,
  iconUrl: string,
  durationMs: number = 5000
) {
  await notifyBasic(id, title, message, iconUrl);
  
  setTimeout(async () => {
    try {
      await clearNotification(id);
    } catch {
      // Notification may have already been closed by user
    }
  }, durationMs);
}

// Usage: Show for 5 seconds
await notifyAutoDismiss(
  "temp-alert",
  "Saved!",
  "Your changes have been saved automatically",
  "icons/check.png"
);
```

---

## API Reference

### Main Exports

| Export | Description |
|--------|-------------|
| `notify(id, options, handlers?)` | Create a notification with full Chrome notifications API options |
| `notifyBasic(id, title, message, iconUrl, handlers?)` | Shorthand for basic text notifications |
| `notifyProgress(id, title, message, iconUrl, progress)` | Create a progress notification (0-100) |
| `updateNotification(id, options)` | Update an existing notification. Returns `Promise<boolean>` |
| `clearNotification(id)` | Clear a notification. Returns `Promise<boolean>` |
| `clearAllHandlers()` | Clear all registered event handlers |

### Notification Types

```typescript
type NotificationType = "basic" | "image" | "list" | "progress";
```

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Fired when notification body is clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Fired when a button is clicked. Index is 0-based |
| `onClose` | `(id: string, byUser: boolean) => void` | Fired when notification closes. `byUser` is true if user closed it |

### NotifyOptions

Full options compatible with Chrome's [NotificationOptions](https://developer.chrome.com/docs/extensions/reference/notifications#type-NotificationOptions):

```typescript
interface NotifyOptions {
  type: NotificationType;
  title: string;
  message: string;
  iconUrl: string;
  contextMessage?: string;
  priority?: 0 | 1 | 2;
  buttons?: Array<{ title: string; iconUrl?: string }>;
  imageUrl?: string;
  items?: Array<{ title: string; message: string }>;
  progress?: number;
  silent?: boolean;
  requireInteraction?: boolean;
}
```

---

## Permissions

Add the `notifications` permission to your `manifest.json`:

```json
{
  "name": "My Extension",
  "version": "1.0.0",
  "manifest_version": 3,
  "permissions": [
    "notifications"
  ]
}
```

For click handlers that open tabs, you may also need:

```json
{
  "permissions": [
    "notifications",
    "tabs"
  ]
}
```

---

## Platform Notes

Notification appearance varies across operating systems:

| OS | Appearance |
|----|------------|
| **macOS** | Native macOS notification center. Supports all features including buttons, progress, and images |
| **Windows** | Windows Action Center. Full support for buttons, progress, and images |
| **Linux** | Desktop notification daemon (libnotify). Feature support varies by desktop environment |

### Best Practices

- **Keep titles short** — macOS truncats at ~50 characters
- **Use clear button labels** — Short, action-oriented text ("Install", "View", "Dismiss")
- **Test on multiple platforms** — Notifications look different on each OS
- **Provide fallbacks** — Consider in-app toasts for critical alerts

---

## Part of @zovo/webext

`webext-notifications` is part of the Zovo WebExtension ecosystem — type-safe utilities for building modern Chrome extensions:

- [webext-reactive-store](https://github.com/theluckystrike/webext-reactive-store) — Reactive state management
- [webext-messages](https://github.com/theluckystrike/webext-messages) — Type-safe message passing
- [webext-storage](https://github.com/theluckystrike/webext-storage) — Simplified storage API

---

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
