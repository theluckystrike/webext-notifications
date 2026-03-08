# Contributing to webext-notifications

Thank you for your interest in contributing to webext-notifications! This guide will help you get started.

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

## Development Setup

1. **Fork the repository**

   Click the "Fork" button on the [GitHub repository](https://github.com/theluckystrike/webext-notifications)

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-notifications.git
   cd webext-notifications
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

## Making Changes

1. **Make your changes**

   - Follow the existing code style
   - Add TypeScript types for any new functionality
   - Write tests for new features

2. **Run tests**

   ```bash
   pnpm test
   ```

3. **Build the project**

   ```bash
   pnpm build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test updates
   - `refactor:` for code refactoring

## Submitting a Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**

   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template
   - Submit your PR

3. **Review process**

   - Maintainers will review your code
   - Address any feedback promptly
   - Once approved, your PR will be merged

## Code Standards

- Use TypeScript for all new code
- Run `pnpm build` before submitting
- Ensure tests pass
- Add JSDoc comments for public APIs

## Questions?

- Open an issue for bugs or feature requests
- Use discussions for questions

We appreciate your contributions!
