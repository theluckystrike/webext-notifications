# Contributing to webext-notifications

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

### Fork the Repository

1. Navigate to the [repository](https://github.com/theluckystrike/webext-notifications)
2. Click the **Fork** button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/webext-notifications.git
cd webext-notifications
```

### Install Dependencies

This project uses pnpm for package management:

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install
```

### Create a Feature Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## Development

### Running Tests

```bash
pnpm test
```

This runs the test suite with Vitest.

### Building

```bash
pnpm build
```

This compiles the TypeScript to JavaScript in the `dist` directory.

### Code Style

- Use TypeScript for all new code
- Run `pnpm test` before committing
- Follow existing code patterns in the project

## Making Changes

1. Make your changes in your feature branch
2. Add tests for new functionality (if applicable)
3. Ensure all tests pass
4. Commit your changes with clear messages:

```bash
git add .
git commit -m "Add feature: description of your changes"
```

## Pull Request Process

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**:
   - Navigate to the original repository
   - Click **New Pull Request**
   - Select your branch and submit

3. **PR Description** should include:
   - Summary of changes
   - Related issue numbers (if applicable)
   - Testing performed

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and improve

## Questions?

If you have questions, feel free to open an issue or reach out through the repository.

---

Thank you for contributing!
