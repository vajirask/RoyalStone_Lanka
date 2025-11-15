# GitHub Pages Deployment Guide

## What Was Fixed

The white page issue on GitHub Pages was caused by:
1. ❌ Missing base path configuration for GitHub Pages subdirectory
2. ❌ BrowserRouter not configured for subdirectory routing
3. ❌ Missing 404.html for SPA routing
4. ❌ Absolute paths not working in production

## Changes Made

### ✅ 1. Updated `vite.config.ts`
- Added `base: "/RoyalStone_Lanka/"` for production builds
- This ensures all assets load from the correct subdirectory

### ✅ 2. Updated `src/App.tsx`
- Added `basename="/RoyalStone_Lanka"` to BrowserRouter for production
- This makes React Router work with the GitHub Pages subdirectory

### ✅ 3. Created `public/404.html`
- Handles SPA routing for GitHub Pages
- Redirects 404 errors to the correct React Router paths

### ✅ 4. Updated `index.html`
- Added script to handle query parameter routing
- Changed favicon path to relative (`./favicon.ico`)

## How to Deploy

### Step 1: Build the Project
```bash
npm run build
```
This creates a `dist` folder with your production files.

### Step 2: Deploy to GitHub Pages

**Option A: Using GitHub Actions (Recommended)**

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. Push to GitHub:
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push
```

3. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

**Option B: Manual Deployment**

1. Build the project:
```bash
npm run build
```

2. Copy `dist` folder contents to `docs` folder:
```bash
# Windows PowerShell
Copy-Item -Path dist\* -Destination docs\ -Recurse -Force
```

3. Commit and push:
```bash
git add docs
git commit -m "Deploy to GitHub Pages"
git push
```

4. Enable GitHub Pages:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **docs** folder
   - Click **Save**

### Step 3: Verify Deployment

Your site should be available at:
**https://vajirask.github.io/RoyalStone_Lanka/**

## Troubleshooting

### Still seeing a white page?
1. **Clear browser cache**: Hard refresh with `Ctrl + Shift + R`
2. **Check browser console**: Open DevTools (F12) and look for errors
3. **Verify base path**: Make sure the URL includes `/RoyalStone_Lanka/`
4. **Check 404.html**: Ensure it's in the `dist` folder after build

### Assets not loading?
- Make sure `vite.config.ts` has the correct base path
- Check that all image paths use relative paths (start with `./` or `/RoyalStone_Lanka/`)

### Routes not working?
- The 404.html file should handle this automatically
- If direct links don't work, try navigating from the home page first

## Testing Locally

To test the production build locally:
```bash
npm run build
npm run preview
```

Then visit: `http://localhost:4173/RoyalStone_Lanka/`

## Notes

- The base path `/RoyalStone_Lanka/` matches your repository name
- If you rename your repository, update the base path in `vite.config.ts` and `App.tsx`
- Development mode (`npm run dev`) still works normally without the base path

