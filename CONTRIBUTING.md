# Contributing to webext-notifications

Thank you for your interest in contributing! This library is part of the @zovo/webext ecosystem.

## Getting Started

### Fork the Repository

1. Visit [theluckystrike/webext-notifications](https://github.com/theluckystrike/webext-notifications)
2. Click the **Fork** button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/webext-notifications.git
cd webext-notifications
```

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Create a Feature Branch

```bash
# Create a new branch for your feature or fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/description-of-fix
```

### Development

```bash
# Run tests
pnpm test

# Build the TypeScript
pnpm build

# Run tests in watch mode
pnpm test --watch
```

### Making Changes

1. Make your changes in the `src/` directory
2. Add or update tests in `src/index.test.ts`
3. Ensure the build passes: `pnpm build`
4. Ensure all tests pass: `pnpm test`

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**:
   - Navigate to the original repository
   - Click **New Pull Request**
   - Select your branch from the dropdown
   - Fill out the PR template with:
     - Description of changes
     - Related issue number (if applicable)
     - Testing performed

3. **PR Guidelines**:
   - Keep changes focused and atomic
   - Update documentation if needed
   - Add tests for new functionality
   - Ensure CI passes

## Code Style

- Use TypeScript with strict mode
- Follow existing code conventions
- Use meaningful variable and function names
- Comment complex logic

## Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists
2. Create a detailed issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (browser, OS)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
