# Contributing to webext-notifications

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork the repository** — Click the "Fork" button on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-notifications.git
   cd webext-notifications
   ```

3. **Install dependencies**
   ```bash
   corepack enable
   pnpm install
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

5. **Build the project**
   ```bash
   pnpm build
   ```

## Project Structure

```
webext-notifications/
├── src/
│   └── index.ts        # Main source code
├── CHANGELOG.md        # Version history
├── LICENSE             # MIT license
├── package.json        # npm package config
├── tsconfig.json       # TypeScript config
└── README.md           # This file
```

## Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** — Follow the existing code style and patterns

3. **Add tests** — Ensure new functionality is covered

4. **Build and test**
   ```bash
   pnpm build && pnpm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **Push and create a PR**
   ```bash
   git push your-fork feature/your-feature-name
   ```

Then open a Pull Request on GitHub.

## Code Style

- Use TypeScript with strict mode
- Follow existing formatting conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

Example:
```
feat: add notification queue support

Add NotificationQueue class for managing multiple notifications
without overwhelming the user with simultaneous alerts.
```

## Testing

Run tests with vitest:
```bash
pnpm test
```

Add tests in the `src/` directory following the pattern `*.test.ts`.

## Questions?

- Open an [issue](https://github.com/theluckystrike/webext-notifications/issues) for bugs or feature requests
- Check existing issues before creating new ones

---

We appreciate all contributions, big and small!
