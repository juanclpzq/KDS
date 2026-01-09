# Installation Guide

Complete installation instructions for the Kitchen Display System.

## Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)

### Check Your Environment

```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show 9.0.0 or higher
```

### Installing Node.js

If you don't have Node.js installed:

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download installer from [nodejs.org](https://nodejs.org/)

## Installation Steps

### 1. Navigate to Project

```bash
cd /Users/juanlopez1/kitchen-display-system
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 18
- TypeScript
- Vite
- Zustand
- Day.js
- Tailwind CSS
- All dev dependencies

**Expected output:**
```
added 234 packages in 15s
```

### 3. Verify Installation

```bash
npm list --depth=0
```

Should show all dependencies installed without errors.

### 4. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 432 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 5. Open in Browser

The app should automatically open at `http://localhost:3000`

If not, manually navigate to that URL.

### 6. Verify Demo Panel

You should see:
- Main KDS grid (empty initially)
- Yellow demo panel at bottom
- "Create Random Order" button

Click "Create Random Order" to test functionality.

## Installation Issues

### Issue: `command not found: npm`

**Cause:** Node.js not installed or not in PATH

**Solution:**
```bash
# Verify Node.js installation
which node

# If empty, install Node.js (see Prerequisites)
```

### Issue: `EACCES: permission denied`

**Cause:** npm trying to install packages in protected directory

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use a Node version manager (recommended)
# Install nvm: https://github.com/nvm-sh/nvm
```

### Issue: `unable to resolve dependency tree`

**Cause:** Conflicting package versions

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: `ERESOLVE could not resolve`

**Cause:** Peer dependency conflicts

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

### Issue: Port 3000 already in use

**Cause:** Another app using port 3000

**Solution:**

**Option 1:** Stop the other app
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

**Option 2:** Use different port
```bash
# Edit vite.config.ts
# Change: port: 3000
# To:     port: 3001
```

### Issue: `Cannot find module 'react'`

**Cause:** Dependencies not installed correctly

**Solution:**
```bash
# Ensure you're in the right directory
pwd  # Should end with /kitchen-display-system

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors on start

**Cause:** Type definitions missing

**Solution:**
```bash
# Install type definitions explicitly
npm install --save-dev @types/react @types/react-dom

# Restart dev server
npm run dev
```

## Production Build

### Build for Production

```bash
npm run build
```

**Expected output:**
```
vite v5.0.8 building for production...
✓ 234 modules transformed.
dist/index.html                  0.45 kB │ gzip:  0.29 kB
dist/assets/index-a1b2c3d4.css   9.87 kB │ gzip:  2.34 kB
dist/assets/index-e5f6g7h8.js  148.23 kB │ gzip: 49.12 kB
✓ built in 2.45s
```

### Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173`

### Deploy Production Build

The `dist/` folder contains the production build:

```bash
# Copy to web server
scp -r dist/* user@server:/var/www/html/kds/

# Or use a static host (Netlify, Vercel, etc.)
```

## Uninstallation

### Remove Project

```bash
cd /Users/juanlopez1
rm -rf kitchen-display-system
```

### Clean npm Cache

```bash
npm cache clean --force
```

## Updating Dependencies

### Check for Updates

```bash
npm outdated
```

### Update All Dependencies

```bash
# Update to latest compatible versions
npm update

# Or update to latest versions (may have breaking changes)
npm install react@latest react-dom@latest zustand@latest dayjs@latest
```

### Update Vite

```bash
npm install vite@latest --save-dev
```

## Development Environment Setup

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**
- **TypeScript and JavaScript Language Features** (built-in)

### Install Extensions

```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]", "([^'\"`]*)"]
  ]
}
```

## Verification Checklist

After installation, verify:

- [ ] `npm run dev` starts without errors
- [ ] Browser opens to `http://localhost:3000`
- [ ] Demo panel visible at bottom
- [ ] "Create Random Order" button works
- [ ] Order appears in grid with blue PAID status
- [ ] Clicking order advances to IN_PROGRESS (amber)
- [ ] Clicking again advances to READY (green)
- [ ] Timer counts up every second
- [ ] "Create Late Order" shows red pulsing card
- [ ] No console errors in browser DevTools

## Getting Help

### Check Documentation

1. [README.md](README.md) - Full documentation
2. [QUICKSTART.md](QUICKSTART.md) - Quick start guide
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
4. [STRUCTURE.md](STRUCTURE.md) - Project structure

### Debug Mode

Enable verbose logging:

```bash
# Development
npm run dev -- --debug

# Build
npm run build -- --debug
```

### Check Console

Open browser DevTools (F12) and check Console tab for errors.

### Common Console Errors

**Error:** `Failed to fetch dynamically imported module`
**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Error:** `Uncaught ReferenceError: process is not defined`
**Solution:** Restart dev server

**Error:** `Module not found`
**Solution:** Verify file path and imports

## Performance Optimization

### After Installation

For better performance:

1. **Use production build** for deployment
2. **Enable gzip** on web server
3. **Use CDN** for static assets
4. **Cache aggressively** (set long cache headers)

### Dev Server Performance

If dev server is slow:

```bash
# Increase memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run dev

# Disable source maps (faster builds)
# Edit vite.config.ts: build.sourcemap: false
```

## Next Steps

After successful installation:

1. Read [QUICKSTART.md](QUICKSTART.md) to learn basic usage
2. Test all demo panel features
3. Review [README.md](README.md) for backend integration
4. Customize colors in `tailwind.config.js`
5. Adjust late thresholds in `src/utils/time.ts`

---

**Need Help?** Check existing documentation or review console errors for specific issues.

**Last Updated:** 2026-01-09
