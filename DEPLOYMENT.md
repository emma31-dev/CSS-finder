# CSS Finder - Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Visual Studio Code**
4. **vsce** (Visual Studio Code Extension Manager)

Install vsce globally:
```bash
npm install -g @vscode/vsce
```

---

## Development & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile TypeScript
```bash
npm run compile
```

### 3. Test Locally (Debug Mode)
- Open the project in VSCode
- Press `F5` to launch Extension Development Host
- In the new window, open a project with CSS files
- Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
- Run: `CSS Finder: Scan for Unused CSS`

### 4. Watch Mode (for development)
```bash
npm run watch
```

---

## Packaging the Extension

### Create .vsix Package
```bash
vsce package
```

This creates a `.vsix` file (e.g., `css-finder-0.0.1.vsix`) that can be:
- Installed locally
- Shared with others
- Published to the marketplace

### Install Locally from .vsix
```bash
code --install-extension css-finder-0.0.1.vsix
```

Or via VSCode UI:
1. Extensions view (`Ctrl+Shift+X`)
2. Click `...` menu → `Install from VSIX...`
3. Select your `.vsix` file

---

## Publishing to VSCode Marketplace

### 1. Create Publisher Account
- Go to https://marketplace.visualstudio.com/manage
- Sign in with Microsoft/GitHub account
- Create a publisher (e.g., `your-publisher-name`)

### 2. Get Personal Access Token (PAT)
- Go to https://dev.azure.com
- User Settings → Personal Access Tokens
- Create new token with:
  - Organization: All accessible organizations
  - Scopes: **Marketplace (Manage)**
  - Expiration: Set as needed

### 3. Login with vsce
```bash
vsce login your-publisher-name
```
Enter your PAT when prompted.

### 4. Update package.json
Add your publisher name:
```json
{
  "publisher": "your-publisher-name",
  ...
}
```

### 5. Publish
```bash
vsce publish
```

Or publish with version bump:
```bash
vsce publish patch  # 0.0.1 → 0.0.2
vsce publish minor  # 0.0.1 → 0.1.0
vsce publish major  # 0.0.1 → 1.0.0
```

---

## Alternative: Open VSX Registry (for VSCodium, etc.)

### Install ovsx
```bash
npm install -g ovsx
```

### Publish to Open VSX
```bash
ovsx publish -p YOUR_ACCESS_TOKEN
```

Get token from: https://open-vsx.org/user-settings/tokens

---

## Pre-Publish Checklist

- [ ] Update version in `package.json`
- [ ] Add `README.md` with usage instructions
- [ ] Add `CHANGELOG.md` documenting changes
- [ ] Add `LICENSE` file
- [ ] Add icon (128x128 PNG) in `package.json`: `"icon": "icon.png"`
- [ ] Test extension thoroughly
- [ ] Add repository URL in `package.json`
- [ ] Review and update `displayName` and `description`
- [ ] Ensure `.vscodeignore` excludes unnecessary files

---

## Updating Published Extension

1. Make your changes
2. Update version in `package.json`
3. Update `CHANGELOG.md`
4. Compile: `npm run compile`
5. Publish: `vsce publish`

---

## Unpublishing

```bash
vsce unpublish your-publisher-name.css-finder
```

**Warning:** Unpublishing is permanent and affects all users.

---

## Useful Commands

```bash
# Verify package contents before publishing
vsce ls

# Show extension info
vsce show your-publisher-name.css-finder

# Package without publishing
vsce package

# Publish specific version
vsce publish 1.0.0
```
