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

## Deployment to Vercel

1. **Push your code to GitHub**.
2. **Import the repository into Vercel**.
3. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `Frontend/dist`
4. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Connection String
   - `JWT_SECRET`: A secure random string for login tokens
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Google App Password
   - `VITE_API_URL`: (Optional) If you want to force a specific backend URL, though Vercel handles `/api` automatically via `vercel.json`.

### Note on Image Uploads
Vercel is a **serverless** platform, meaning files uploaded to the `Backend/uploads` folder will be deleted shortly after upload. For a production app, we recommend connecting **Cloudinary** or **AWS S3** for persistent image storage.

## License
This project is private and proprietary.
