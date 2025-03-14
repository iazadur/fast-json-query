# Contributing to Fast JSON Query

First off, thank you for considering contributing to Fast JSON Query! It's people like you that make Fast JSON Query such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include code samples and screenshots if relevant

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When you are creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- Ensure the test suite passes
- Make sure your code lints
- Update the documentation

## Development Setup

1. Fork and clone the repo
2. Run `npm install` to install dependencies
3. Create a branch for your changes
4. Make your changes
5. Run tests with `npm test`
6. Push to your fork and submit a pull request

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - 🐎 `:racehorse:` when improving performance
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - 🔥 `:fire:` when removing code or files
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security
  - ⬆️ `:arrow_up:` when upgrading dependencies
  - ⬇️ `:arrow_down:` when downgrading dependencies

### JavaScript/TypeScript Styleguide

- Use 2 spaces for indentation
- Use semicolons
- Use `const` for all references; avoid using `var`
- Use template literals instead of string concatenation
- Use the spread operator (`...`) instead of `.apply()`
- Use arrow functions `=>` instead of `function` keyword
- Add trailing commas for cleaner diffs
- Use descriptive variable names

### Testing Styleguide

- Treat `describe` as a noun or situation
- Treat `it` as a statement about state or how an operation changes state
- Use `beforeEach` for setup
- Use `afterEach` for cleanup
- Keep tests focused and minimal

## Project Structure

```
fast-json-query/
├── src/                # Source code
│   ├── index.ts       # Main entry point
│   ├── types.ts       # TypeScript types
│   └── hooks/         # React hooks
├── __tests__/         # Test files
├── .github/           # GitHub specific files
└── docs/             # Documentation
```

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
