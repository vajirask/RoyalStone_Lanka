# Fix for White Page on GitHub Pages

## ✅ What I Fixed

1. **Updated vite.config.ts** - Fixed base path detection
2. **Created GitHub Actions workflow** - Automated deployment
3. **Verified build output** - All files are correctly built

## 🚀 How to Deploy (Step by Step)

### Method 1: Using GitHub Actions (Recommended - Automatic)

1. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment"
   git push
   ```

2. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/vajirask/RoyalStone_Lanka
   - Click **Settings** (top menu)
   - Click **Pages** (left sidebar)
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Wait for deployment:**
   - Go to **Actions** tab in your repository
   - You'll see the workflow running
   - Wait for it to complete (usually 2-3 minutes)
   - Your site will be live at: https://vajirask.github.io/RoyalStone_Lanka/

### Method 2: Manual Deployment (If Actions doesn't work)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create/Update docs folder:**
   ```powershell
   # Copy dist contents to docs folder
   Remove-Item -Path docs -Recurse -Force -ErrorAction SilentlyContinue
   New-Item -ItemType Directory -Path docs
   Copy-Item -Path dist\* -Destination docs\ -Recurse -Force
   ```

3. **Commit and push:**
   ```bash
   git add docs
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

4. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **docs** folder
   - Click **Save**

## 🔍 Troubleshooting

### Still seeing white page?

1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Or use Incognito/Private mode

2. **Check browser console:**
   - Press `F12` to open DevTools
   - Go to **Console** tab
   - Look for any red error messages
   - Share the errors if you see any

3. **Verify the URL:**
   - Make sure you're visiting: `https://vajirask.github.io/RoyalStone_Lanka/`
   - Note the trailing slash and capital letters

4. **Check GitHub Pages status:**
   - Go to **Settings** → **Pages**
   - Make sure it shows "Your site is live at..."

### Common Issues:

- **404 errors**: Make sure 404.html is in the dist folder (it should be)
- **Assets not loading**: Check that base path is `/RoyalStone_Lanka/`
- **Routes not working**: The 404.html handles this automatically

## 📝 Files Changed

- ✅ `vite.config.ts` - Base path configuration
- ✅ `src/App.tsx` - BrowserRouter basename
- ✅ `public/404.html` - SPA routing support
- ✅ `.github/workflows/deploy.yml` - Automated deployment

## 🎯 Next Steps

1. Push the code to GitHub
2. Enable GitHub Actions in Settings → Pages
3. Wait for deployment to complete
4. Visit your site and it should work!

If you still see a white page after following these steps, please check the browser console (F12) and share any error messages you see.

