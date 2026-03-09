# Contributing to webext-notifications

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/niceByte/webext-notifications.git
   cd webext-notifications
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## Project Structure

```
webext-notifications/
├── src/
│   └── index.ts      # Main source code
├── dist/             # Compiled output
├── README.md         # Documentation
├── CONTRIBUTING.md   # This file
└── package.json      # Package configuration
```

## Making Changes

### Code Style

- Use TypeScript with strict mode
- Run `npm run build` before committing
- Ensure all tests pass

### Testing

Add tests for new functionality in `src/index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("your feature", () => {
  it("should work correctly", () => {
    // Test implementation
  });
});
```

### Commit Messages

Follow conventional commit format:

- `feat: add new notification type`
- `fix: resolve handler memory leak`
- `docs: update API documentation`
- `test: add tests for progress notifications`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and add tests
3. Ensure build and tests pass
4. Update documentation if needed
5. Push and open a pull request

## Reporting Issues

When reporting bugs, include:

- Browser and OS version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
