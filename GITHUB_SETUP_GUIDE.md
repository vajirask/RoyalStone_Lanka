# Step-by-Step Guide: Finding or Creating a GitHub Repository

## Option 1: Find Your Existing Repository

### Step 1: Go to GitHub
1. Open your web browser
2. Go to: **https://github.com**
3. Sign in to your account (if not already signed in)

### Step 2: Find Your Repository
1. Click on your **profile picture** (top right corner)
2. Click on **"Your repositories"** from the dropdown menu
3. Look for **"RoyalStone_Lanka"** in the list
4. Click on it to open the repository

### Step 3: View the Repository Link
1. Once on the repository page, look at the **URL bar** in your browser
2. The URL will be: `https://github.com/vajirask/RoyalStone_Lanka`
3. This is your repository link!

### Step 4: Copy the Link
1. Click the green **"Code"** button (top right)
2. You'll see the repository URL in a dropdown
3. Click the **copy icon** (📋) next to the URL to copy it

---

## Option 2: Create a New Repository (If You Don't Have One)

### Step 1: Sign In to GitHub
1. Go to: **https://github.com**
2. Click **"Sign in"** (top right)
3. Enter your username and password
4. Click **"Sign in"**

### Step 2: Create New Repository
1. Click the **"+"** icon (top right corner, next to your profile picture)
2. Click **"New repository"** from the dropdown menu

### Step 3: Fill in Repository Details
1. **Repository name**: Enter `RoyalStone_Lanka` (or any name you prefer)
2. **Description** (optional): Enter "Authentic Sri Lankan Gemstones Marketplace"
3. Choose visibility:
   - **Public**: Anyone can see it
   - **Private**: Only you can see it (recommended for now)
4. **DO NOT** check "Add a README file" (we already have one)
5. **DO NOT** add .gitignore or license (we'll add these ourselves)

### Step 4: Create the Repository
1. Click the green **"Create repository"** button at the bottom

### Step 5: Copy the Repository URL
1. After creating, you'll see a page with setup instructions
2. Look for the section that says **"…or push an existing repository from the command line"**
3. You'll see a URL like: `https://github.com/YOUR_USERNAME/RoyalStone_Lanka.git`
4. **Copy this URL** - you'll need it in the next steps

---

## Option 3: Connect Your Local Project to GitHub

### Step 1: Open Terminal/Command Prompt
1. Open PowerShell or Command Prompt
2. Navigate to your project folder:
   ```powershell
   cd D:\se
   ```

### Step 2: Initialize Git (If Not Already Done)
```powershell
git init
```

### Step 3: Add All Files
```powershell
git add .
```

### Step 4: Create First Commit
```powershell
git commit -m "Initial commit"
```

### Step 5: Add GitHub Repository as Remote
```powershell
git remote add origin https://github.com/vajirask/RoyalStone_Lanka.git
```
*(Replace with your actual repository URL if different)*

### Step 6: Rename Branch to Main
```powershell
git branch -M main
```

### Step 7: Push to GitHub
```powershell
git push -u origin main
```

### Step 8: Enter Credentials
- If prompted, enter your GitHub username
- For password, you'll need a **Personal Access Token** (see below)

---

## Creating a Personal Access Token (For Password)

### Step 1: Go to GitHub Settings
1. Click your **profile picture** (top right)
2. Click **"Settings"**

### Step 2: Create Token
1. Scroll down and click **"Developer settings"** (left sidebar)
2. Click **"Personal access tokens"**
3. Click **"Tokens (classic)"**
4. Click **"Generate new token"**
5. Click **"Generate new token (classic)"**

### Step 3: Configure Token
1. **Note**: Give it a name like "RoyalStone Project"
2. **Expiration**: Choose how long it should last (90 days, 1 year, etc.)
3. **Scopes**: Check **"repo"** (this gives full repository access)
4. Scroll down and click **"Generate token"**

### Step 4: Copy Token
1. **IMPORTANT**: Copy the token immediately (you won't see it again!)
2. Save it somewhere safe
3. When Git asks for password, **paste this token** instead of your password

---

## Quick Check: Is Your Repository Already Connected?

Run this command to check:
```powershell
git remote -v
```

If you see:
```
origin  https://github.com/vajirask/RoyalStone_Lanka.git
```
Then your repository is already connected! ✅

---

## Troubleshooting

### "Repository not found" Error
- Make sure the repository exists on GitHub
- Check that you're using the correct URL
- Verify you have access to the repository

### "Authentication failed" Error
- Use a Personal Access Token instead of password
- Make sure the token has "repo" permissions

### "Nothing to commit" Message
- Your files might already be committed
- Check with: `git status`

---

## Your Current Repository Link

**https://github.com/vajirask/RoyalStone_Lanka**

You can share this link with others or use it to clone the repository!

