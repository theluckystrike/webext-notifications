# webext-notifications

[![npm version](https://img.shields.io/npm/v/webext-notifications.svg)](https://www.npmjs.com/package/webext-notifications)
[![npm downloads](https://img.shields.io/npm/dm/webext-notifications.svg)](https://www.npmjs.com/package/webext-notifications)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/npm/l/webext-notifications.svg)](LICENSE)

Typed notification wrapper with click handlers for Chrome extensions.

Part of the [@zovo/webext](https://github.com/niceByte/zovo-webext) ecosystem — a collection of type-safe utilities for building Chrome extensions.

## Features

- **🦔 Type-safe** — Full TypeScript support with typed notifications and handlers
- **👆 Click handlers** — Handle notification clicks, button clicks, and close events
- **🔘 Button actions** — Add interactive buttons with custom click handlers
- **📊 Progress notifications** — Display download/upload progress with built-in updates
- **⏱️ Auto-dismiss** — Notifications auto-close after use (or stay until dismissed)
- **🔄 Update existing** — Modify running notifications (great for progress updates)
- **📝 Notification templates** — Reusable notification patterns for common use cases

## Install

```bash
npm install webext-notifications
```

### Required Permissions

Add the `notifications` permission to your `manifest.json`:

```json
{
  "permissions": [
    "notifications"
  ]
}
```

## Quick Start

### Basic Notification

The simplest way to show a notification with text and an icon:

```typescript
import { notifyBasic } from "webext-notifications";

await notifyBasic(
  "welcome",
  "Hello!",
  "Welcome to the extension",
  "icons/icon.png"
);
```

### Notification with Buttons

Add interactive buttons for user actions:

```typescript
import { notify } from "webext-notifications";

await notify(
  "update-available",
  {
    type: "basic",
    title: "New Update",
    message: "Version 2.0 is available",
    iconUrl: "icons/update.png",
    buttons: [
      { title: "Update Now" },
      { title: "Later" }
    ],
    requireInteraction: true,
  },
  {
    onButtonClick: (id, buttonIndex) => {
      if (buttonIndex === 0) {
        installUpdate();
      }
    },
  }
);
```

### Click Handler

Handle clicks on the notification body:

```typescript
import { notifyBasic } from "webext-notifications";

await notifyBasic(
  "open-settings",
  "Settings Updated",
  "Click to view your settings",
  "icons/settings.png",
  {
    onClick: (id) => {
      chrome.runtime.openOptionsPage();
    },
  }
);
```

## Advanced Patterns

### Progress Notification

Track long-running operations with real-time progress updates:

```typescript
import { notifyProgress, updateNotification, clearNotification } from "webext-notifications";

// Create initial progress notification
await notifyProgress(
  "download",
  "Downloading File",
  "Starting download...",
  "icons/download.png",
  0
);

// Simulate progress updates
for (let progress = 0; progress <= 100; progress += 10) {
  await updateNotification("download", {
    progress,
    message: `${progress}% complete`,
  });
  
  await new Promise(r => setTimeout(r, 200));
}

// Clear when done
await clearNotification("download");
```

### Notification Queue

Manage multiple notifications without overwhelming the user:

```typescript
import { notifyBasic } from "webext-notifications";

class NotificationQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private delayMs = 3000;

  async enqueue(notificationFn: () => Promise<void>) {
    this.queue.push(notificationFn);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await new Promise(r => setTimeout(r, this.delayMs));
    }
    
    this.processing = false;
  }
}

const queue = new NotificationQueue();

// Queue multiple notifications
queue.enqueue(() => notifyBasic("task1", "Task 1", "First task complete", "icons/check.png"));
queue.enqueue(() => notifyBasic("task2", "Task 2", "Second task complete", "icons/check.png"));
queue.enqueue(() => notifyBasic("task3", "Task 3", "Third task complete", "icons/check.png"));
```

### Deep-Link on Click

Open specific tabs or URLs when user clicks a notification:

```typescript
import { notifyBasic } from "webext-notifications";

async function notifyAndOpenTab(id: string, title: string, url: string) {
  await notifyBasic(id, "Link Opened", `Opening ${title}`, "icons/link.png", {
    onClick: async () => {
      // Check if tab already exists
      const tabs = await chrome.tabs.query({ url });
      
      if (tabs.length > 0) {
        // Focus existing tab
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId, { focused: true });
      } else {
        // Create new tab
        await chrome.tabs.create({ url, active: true });
      }
    },
  });
}

// Usage
await notifyAndOpenTab("docs", "Documentation", "https://docs.example.com");
```

### Notification with Deep-Link Data

Pass data through notifications using the notification ID:

```typescript
import { notify } from "webext-notifications";

// Use structured IDs to encode data
const userId = "user-123";
const action = "message";

await notify(
  `new-message-${userId}`,
  {
    type: "basic",
    title: "New Message",
    message: "You have a new message from John",
    iconUrl: "icons/message.png",
  },
  {
    onClick: (id) => {
      // Extract user ID from notification ID
      const [, , extractedUserId] = id.split("-");
      chrome.tabs.create({
        url: `https://app.example.com/messages/${extractedUserId}`,
      });
    },
  }
);
```

## API Reference

### Exports

| Export | Type | Description |
|--------|------|-------------|
| `notify` | `(id, options, handlers?) => Promise<string>` | Create notification with full options |
| `notifyBasic` | `(id, title, message, iconUrl, handlers?) => Promise<string>` | Shorthand for basic text notifications |
| `notifyProgress` | `(id, title, message, iconUrl, progress) => Promise<string>` | Create/update progress notification (0-100) |
| `updateNotification` | `(id, options) => Promise<boolean>` | Update an existing notification |
| `clearNotification` | `(id) => Promise<boolean>` | Clear a notification |
| `clearAllHandlers` | `() => void` | Clear all registered handlers |

### Types

```typescript
type NotificationType = "basic" | "image" | "list" | "progress";

interface NotificationButton {
  title: string;
  iconUrl?: string;
}

interface NotificationItem {
  title: string;
  message: string;
}

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
```

### Event Handlers

| Handler | Signature | Description |
|---------|-----------|-------------|
| `onClick` | `(id: string) => void` | Fired when notification body is clicked |
| `onButtonClick` | `(id: string, buttonIndex: number) => void` | Fired when a button is clicked |
| `onClose` | `(id: string, byUser: boolean) => void` | Fired when notification is closed |

### Handler Signatures

```typescript
type ClickHandler = (notificationId: string) => void;
type ButtonClickHandler = (notificationId: string, buttonIndex: number) => void;
type CloseHandler = (notificationId: string, byUser: boolean) => void;
```

## Platform Notes

Notification appearance varies across operating systems:

- **macOS**: Uses native Notification Center; limited button support
- **Windows**: Shows in Action Center; full button support
- **Linux**: Varies by desktop environment (GNOME, KDE, etc.)

### Platform-Specific Tips

- **macOS**: Buttons may not display; avoid critical actions in buttons
- **Linux**: Some distros require `libnotify`; test on target systems
- **Chrome OS**: Full support; notifications appear in system tray

## Part of @zovo/webext

`webext-notifications` is part of the @zovo/webext ecosystem:

- [webext-tabs](https://github.com/niceByte/webext-tabs) — Tab management utilities
- [webext-storage](https://github.com/niceByte/webext-storage) — Typed storage wrapper
- [webext-context-menu](https://github.com/niceByte/webext-context-menu) — Context menu builder
- [webext-event-bus](https://github.com/niceByte/webext-event-bus) — Cross-context event bus

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by [theluckystrike](https://github.com/niceByte) | [zovo.one](https://zovo.one)
