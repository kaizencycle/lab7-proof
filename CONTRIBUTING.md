# Contributing to Lab7 OAA

Thank you for your interest in contributing to Lab7 OAA! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Docker (optional)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/lab7-oaa.git
   cd lab7-oaa
   ```

2. **Set up the backend:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Set up the frontend:**
   ```bash
   cd frontend/reflections-app
   npm install
   ```

4. **Set up pre-commit hooks:**
   ```bash
   pre-commit install
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

Examples:
- `feat(api): add verification endpoint`
- `fix(crypto): handle invalid key format`
- `docs(readme): update installation instructions`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite** and ensure all tests pass
6. **Submit a pull request** with a clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Coding Standards

### Python

- Follow [PEP 8](https://pep8.org/) style guidelines
- Use [Black](https://black.readthedocs.io/) for code formatting
- Use [isort](https://pycqa.github.io/isort/) for import sorting
- Use [mypy](https://mypy.readthedocs.io/) for type checking
- Maximum line length: 88 characters

### TypeScript/JavaScript

- Use [Prettier](https://prettier.io/) for code formatting
- Follow [ESLint](https://eslint.org/) rules
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### General

- Write clear, self-documenting code
- Add comments for complex logic
- Use meaningful commit messages
- Keep functions small and focused
- Follow the DRY principle

## Testing

### Backend Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_verification.py

# Run with verbose output
pytest -v
```

### Frontend Testing

```bash
cd frontend/reflections-app

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Requirements

- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test API endpoints and database interactions
- **End-to-end tests**: Test complete user workflows
- **Coverage**: Maintain at least 80% code coverage

## Documentation

### Code Documentation

- Use docstrings for all public functions and classes
- Follow [Google docstring format](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- Include type hints for all function parameters and return values

### API Documentation

- Update OpenAPI specifications for API changes
- Include examples for all endpoints
- Document error responses and status codes

### User Documentation

- Update README.md for significant changes
- Add or update guides in the `docs/` directory
- Include screenshots for UI changes

## Security

### Security Considerations

- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate all inputs thoroughly
- Follow secure coding practices
- Report security vulnerabilities privately

### Reporting Security Issues

If you discover a security vulnerability, please report it privately:

1. Email: security@lab7-oaa.com
2. Include a detailed description
3. Include steps to reproduce
4. Do not create public issues for security vulnerabilities

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Security review completed

## Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: For real-time chat (link in README)

### Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## License

By contributing to Lab7 OAA, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:

1. Check existing [GitHub Issues](https://github.com/lab7-oaa/lab7-oaa/issues)
2. Start a [GitHub Discussion](https://github.com/lab7-oaa/lab7-oaa/discussions)
3. Contact the maintainers

Thank you for contributing to Lab7 OAA! 🚀