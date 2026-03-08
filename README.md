<div align="center">

# @theluckystrike/webext-notifications

Typed notification wrapper with click handlers for Chrome extensions. Create rich notifications with buttons, progress bars, and event handling.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-notifications)](https://www.npmjs.com/package/@theluckystrike/webext-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-notifications)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Rich notifications** -- basic, image, list, and progress types
- **Click handlers** -- notification and button click callbacks
- **Auto-clear** -- optional automatic dismissal
- **Typed** -- full TypeScript support for notification options
- **Promise-based** -- async/await for create, update, clear
- **Event listeners** -- click, close, button click, and permission events

## Installation

```bash
npm install @theluckystrike/webext-notifications
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add @theluckystrike/webext-notifications
# or
yarn add @theluckystrike/webext-notifications
```

</details>

## Quick Start

```typescript
import { Notifications } from "@theluckystrike/webext-notifications";

const id = await Notifications.create({
  type: "basic",
  title: "Hello",
  message: "World",
  iconUrl: "icon.png",
});

Notifications.onClicked((notificationId) => {
  console.log("Clicked:", notificationId);
});
```

## API

| Method | Description |
|--------|-------------|
| `create(options)` | Create a notification |
| `update(id, options)` | Update an existing notification |
| `clear(id)` | Dismiss a notification |
| `getAll()` | Get all active notifications |
| `onClicked(callback)` | Listen for notification clicks |
| `onClosed(callback)` | Listen for notification dismissals |
| `onButtonClicked(callback)` | Listen for button clicks |

## Permissions

```json
{ "permissions": ["notifications"] }
```

## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
