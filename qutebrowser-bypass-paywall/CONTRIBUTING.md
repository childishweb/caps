# Contributing to Qutebrowser Bypass Paywall

First off, thank you for considering contributing! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear descriptive title**
- **Detailed steps to reproduce**
- **Expected vs actual behavior**
- **Qutebrowser version**: `:version` output
- **OS and version**
- **Filter update date**: Check `~/.config/qutebrowser/bypass-paywalls/last-update`

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear descriptive title**
- **Detailed description** of the proposed functionality
- **Why this enhancement would be useful**
- **Possible implementation** (if you have ideas)

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Pull Request Guidelines

- **Keep PRs focused**: One feature/fix per PR
- **Update documentation**: If you change functionality, update README.md
- **Test your changes**: Ensure scripts work on your system
- **Follow shell script best practices**: Use shellcheck if possible
- **Add comments**: Explain complex logic

### Filter Issues

**Important**: Issues with specific websites or filter rules should be reported to:
- [Bypass Paywalls Clean Filters Repository](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/issues)

This repository only handles the qutebrowser integration scripts.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/qutebrowser-bypass-paywall.git
cd qutebrowser-bypass-paywall

# Create a test branch
git checkout -b test-changes

# Make your changes

# Test installation (use a backup of your config!)
./install.sh

# Test filter updates
~/.config/qutebrowser/bypass-paywalls/update-filters.sh
```

## Code Style

### Shell Scripts

- Use `#!/bin/bash` (not `#!/bin/sh`)
- Enable strict mode: `set -e`
- Quote variables: `"$VARIABLE"`
- Use meaningful variable names
- Add comments for complex logic
- Use colors for output (defined constants: GREEN, BLUE, YELLOW, RED, NC)

Example:
```bash
#!/bin/bash
set -e

# Clear descriptive comment
QUTE_CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/qutebrowser"

echo -e "${BLUE}→${NC} Doing something..."
```

### Python Config

- Follow PEP 8 style guide
- Add comments explaining qutebrowser-specific settings
- Use pathlib for cross-platform paths
- Include error handling

## Testing

Before submitting a PR, test:

1. **Fresh installation** on a clean qutebrowser config
2. **Update script** runs without errors
3. **Filters load** in qutebrowser (`:adblock-update`)
4. **Uninstall script** cleans up properly
5. **Scripts work** with both curl and wget

### Test Checklist

- [ ] Scripts execute without errors
- [ ] Filters download successfully
- [ ] Qutebrowser loads filters
- [ ] Works on your OS (specify which in PR)
- [ ] Documentation updated
- [ ] No sensitive data in commits

## Git Commit Messages

- Use present tense: "Add feature" not "Added feature"
- Use imperative mood: "Move file to..." not "Moves file to..."
- First line: max 50 characters
- Reference issues: "Fix #123"

Good examples:
```
Add automatic filter update check

Update README with troubleshooting steps

Fix: Handle missing curl/wget gracefully (#15)
```

## Documentation

- Update README.md for user-facing changes
- Add comments in code for complex logic
- Update config.py.example if adding config options
- Keep documentation clear and beginner-friendly

## Project Structure

```
qutebrowser-bypass-paywall/
├── install.sh              # Main installation script
├── update-filters.sh       # Filter download/update script
├── uninstall.sh           # Removal script
├── config.py.example      # Qutebrowser configuration
├── README.md              # User documentation
├── CONTRIBUTING.md        # This file
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

## Questions?

- Open an issue for questions
- Check [qutebrowser documentation](https://qutebrowser.org/doc/)
- See [Bypass Paywalls Clean](https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters) for filter questions

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
