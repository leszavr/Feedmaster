# Contributing to FeedMaster

We love your input! We want to make contributing to FeedMaster as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for API changes

### Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── auth/        # Authentication components
│   ├── bots/        # Bot management components
│   ├── sources/     # Content source components
│   └── moderation/  # Content moderation components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add content source filtering by date range
fix: resolve authentication token refresh issue
docs: update API documentation for bot management
```

## Any Contributions You Make Will Be Under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report Bugs Using GitHub Issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/leszavr/Feedmaster/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/Feedmaster.git
   cd Feedmaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Run linting**
   ```bash
   npm run lint
   ```

## Feature Requests

We're always looking for suggestions to improve FeedMaster. If you have an idea:

1. Check if it's already been suggested in [Issues](https://github.com/leszavr/Feedmaster/issues)
2. If not, create a new issue with the `enhancement` label
3. Provide a clear description of the feature
4. Explain why it would be useful
5. Consider offering to implement it yourself!

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Questions?

Feel free to reach out to the maintainers:

- Email: contribute@feedmaster.io
- Discord: [Join our community](https://discord.gg/feedmaster)
- GitHub: [@leszavr](https://github.com/leszavr)

Thank you for contributing to FeedMaster! 🚀