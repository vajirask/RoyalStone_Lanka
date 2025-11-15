# RoyalStone Lanka

**GitHub Repository**: https://github.com/vajirask/RoyalStone_Lanka

A modern web application for learning, identifying, and trading authentic Sri Lankan gemstones. Features expert education, AI-powered recognition, and a trusted marketplace.

## Features

- 🏪 **Marketplace**: Browse and purchase authentic Sri Lankan gemstones
- 📚 **Education**: Learn about different gemstones and their properties
- 🤖 **AI Recognition**: AI-powered gemstone identification
- 👤 **User Accounts**: Login and registration system
- 🛒 **Seller Dashboard**: Manage your gemstone listings
- 🔐 **Admin Panel**: Administrative controls

## Technologies

- **Vite** - Build tool
- **React** - UI framework
- **TypeScript** - Type safety
- **shadcn-ui** - UI components
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **TanStack Query** - Data fetching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/vajirask/RoyalStone_Lanka.git

# Navigate to the project directory
cd RoyalStone_Lanka

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Images and static assets
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Enable GitHub Actions:**
   - Go to your repository → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main`

2. **Your site will be available at:**
   - https://vajirask.github.io/RoyalStone_Lanka/

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy `dist` folder contents to `docs` folder and push to GitHub

3. Enable GitHub Pages in Settings → Pages → Source: `docs` folder

### Troubleshooting

- **White page?** Clear browser cache (Ctrl + Shift + R) or use incognito mode
- **404 errors?** Make sure the base path `/RoyalStone_Lanka/` is correct
- **Assets not loading?** Check browser console (F12) for errors

## License

This project is private and proprietary.
