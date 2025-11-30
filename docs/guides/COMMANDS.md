# 🎯 Commands Cheat Sheet

Quick reference for all available commands in this project.

---

## 📦 Package Management

### Install Dependencies

```bash
# Install all dependencies
npm install

# Install specific package
npm install <package-name>

# Install dev dependency
npm install -D <package-name>

# Clean install (delete node_modules first)
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Development

### Start Development Server

```bash
npm run dev
# Opens at http://localhost:5173
# Hot Module Replacement (HMR) enabled
```

### Build for Production

```bash
npm run build
# Output: dist/ folder
# Optimized and minified
```

### Preview Production Build

```bash
npm run preview
# Opens at http://localhost:4173
# Test production build locally
```

---

## 🔍 Code Quality

### Type Check TypeScript

```bash
npm run type-check
# Checks TypeScript types without building
# Same as: tsc --noEmit
```

### Lint Code

```bash
npm run lint
# Checks code style and errors
# Uses ESLint configuration
```

### Format Code (if Prettier is set up)

```bash
# Format all files
npx prettier --write .

# Format specific files
npx prettier --write "src/**/*.{ts,tsx}"

# Check formatting without changing files
npx prettier --check .
```

---

## 🧹 Clean Up

### Clear Build Cache

```bash
# Delete build output
rm -rf dist

# Delete node_modules
rm -rf node_modules

# Delete lock files
rm package-lock.json  # npm
rm yarn.lock          # yarn
rm pnpm-lock.yaml     # pnpm
```

### Clean Install

```bash
# Complete clean reinstall
rm -rf node_modules package-lock.json dist
npm install
```

---

## 🐛 Debugging

### Check Node Version

```bash
node --version
# Should be v18 or higher
```

### Check npm Version

```bash
npm --version
```

### Check for Outdated Packages

```bash
npm outdated
```

### View Installed Packages

```bash
npm list --depth=0
```

### Check for Security Vulnerabilities

```bash
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🌐 Environment Variables

### View Current Environment Variables

```bash
# Windows (PowerShell)
Get-Content .env

# Mac/Linux
cat .env
```

### Create .env from Example

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

---

## 🎨 Tailwind CSS

### Rebuild Tailwind CSS

```bash
# Tailwind rebuilds automatically with Vite
# But if needed, restart dev server:
npm run dev
```

### Check Tailwind Config

```bash
# View config
cat tailwind.config.js

# Test config (check for errors)
npx tailwindcss --help
```

---

## 📊 Git Commands

### Initialize Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### Create New Branch

```bash
git checkout -b feature/new-feature
```

### Commit Changes

```bash
git add .
git commit -m "Description of changes"
```

### Push to GitHub

```bash
# First time
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Subsequent pushes
git push origin main
```

### Check Status

```bash
git status
git log --oneline
```

---

## 🚢 Deployment

### Deploy to Vercel (CLI)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deploy to Netlify (CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## 🔧 Troubleshooting Commands

### Port Already in Use

```bash
# Windows (PowerShell)
# Find process using port 5173
netstat -ano | findstr :5173
# Kill process (replace PID)
taskkill /PID <PID> /F

# Mac/Linux
# Find and kill process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Clear Vite Cache

```bash
rm -rf node_modules/.vite
npm run dev
```

### Fix TypeScript Errors

```bash
# Check for errors
npm run type-check

# Common fix: Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Fix ESLint Issues

```bash
# Check for issues
npm run lint

# Auto-fix issues
npx eslint src --ext ts,tsx --fix
```

---

## 🎓 VS Code Commands

### Open in VS Code

```bash
code .
```

### VS Code Terminal

```bash
# Open terminal in VS Code
# Press: Ctrl+` (backtick)
```

### Quick File Search

```
# In VS Code
# Press: Ctrl+P
```

### Command Palette

```
# In VS Code
# Press: Ctrl+Shift+P
```

---

## 📱 Testing

### Test Build Locally

```bash
# Build production version
npm run build

# Serve locally
npm run preview

# Open http://localhost:4173
```

### Check Build Size

```bash
npm run build

# Output shows gzipped sizes:
# dist/index.html                  0.46 kB
# dist/assets/index-abc123.css    42.34 kB │ gzip: 8.12 kB
# dist/assets/index-abc123.js    524.56 kB │ gzip: 156.78 kB
```

---

## 🗄️ Supabase Commands

### Using Supabase CLI (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Push database changes
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

---

## 🔑 Environment Variables Management

### Vercel Environment Variables

```bash
# Add variable
vercel env add VITE_SUPABASE_URL production

# List variables
vercel env ls

# Remove variable
vercel env rm VITE_SUPABASE_URL production
```

### Netlify Environment Variables

```bash
# Add variable
netlify env:set VITE_SUPABASE_URL "your-value"

# List variables
netlify env:list

# Delete variable
netlify env:unset VITE_SUPABASE_URL
```

---

## 📦 Package Updates

### Update All Packages

```bash
# Check for updates
npm outdated

# Update all to latest
npm update

# Update specific package
npm install <package-name>@latest

# Interactive update (use npm-check-updates)
npx npm-check-updates -u
npm install
```

### Update Vite

```bash
npm install vite@latest -D
```

### Update React

```bash
npm install react@latest react-dom@latest
npm install @types/react@latest @types/react-dom@latest -D
```

### Update Tailwind CSS

```bash
npm install tailwindcss@latest postcss@latest autoprefixer@latest -D
```

---

## 🎨 Useful One-Liners

### Count Lines of Code

```bash
# Count TypeScript/TSX files
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Count all code files
find src -type f | xargs wc -l
```

### Find Large Files

```bash
# Find files larger than 100KB
find src -type f -size +100k
```

### Search in Files

```bash
# Search for text in all files
grep -r "searchTerm" src/

# Search in specific file types
grep -r "searchTerm" src/ --include="*.tsx"
```

---

## 🚀 Performance Analysis

### Analyze Bundle Size

```bash
npm run build

# Then check dist/ folder
# Or use bundle analyzer:
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts and rebuild
```

### Check Lighthouse Score

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view
```

---

## 💡 Quick Tips

### Create Component

```bash
# Create new component file
touch src/components/MyComponent.tsx
```

### Create Multiple Files

```bash
mkdir src/components/NewFeature
touch src/components/NewFeature/{index.tsx,styles.css,types.ts}
```

### View File Structure

```bash
# Show directory tree
tree src/

# Or use ls
ls -R src/
```

---

## 🆘 Emergency Commands

### Complete Reset

```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json dist .vite
npm install
npm run dev
```

### Revert Git Changes

```bash
# Discard all uncommitted changes
git reset --hard HEAD

# Revert to previous commit
git revert HEAD
```

### Kill All Node Processes

```bash
# Mac/Linux
killall node

# Windows (PowerShell)
taskkill /F /IM node.exe
```

---

## 📚 Help Commands

### npm Help

```bash
npm help
npm help <command>
```

### Vite Help

```bash
npx vite --help
```

### TypeScript Help

```bash
npx tsc --help
```

---

## 🎯 Most Used Commands

```bash
# Daily workflow
npm install           # Install dependencies
npm run dev          # Start development
npm run build        # Build for production
npm run type-check   # Check TypeScript
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push             # Push to remote

# Troubleshooting
rm -rf node_modules package-lock.json && npm install
npm run type-check
npm audit fix
```

---

## 🔖 Bookmark This!

Save this file for quick reference during development.

**Location:** `COMMANDS.md`

---

Made with ❤️ for the Weekly Vegetarian Menu Project
