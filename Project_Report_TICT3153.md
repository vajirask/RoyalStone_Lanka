# Software Project Report – TICT 3153

## 1. Project Overview
*   **Project Title**: RoyalStone Lanka – Gemstone Intelligence & Marketplace Platform
*   **Prepared by**: [Student Name / Vajira S. K.]
*   **Department / Faculty**: Department of ICT / Faculty of Technology
*   **University Name**: University of Vavuniya, Sri Lanka
*   **Submission Date**: February 14, 2026

---

## 2. Objectives & Scope
### Objectives
*   **Modernize Gemstone Identification**: Deploy a browser-based AI engine using TensorFlow.js to allow instant, hardware-independent identification of Sri Lankan gemstones.
*   **Enhance Market Trust**: Establish a secure, role-based marketplace where only verified sellers can list authentic, certified stones.
*   **Educational Literacy**: Create a comprehensive "Gem Guide" to educate users on the optical and physical properties of 10+ major Sri Lankan gemstone species.
*   **Decentralized Access**: Enable small-scale local miners and sellers to reach a global market through a unified digital storefront.

### Scope
*   **Functional Boundaries**:
    *   AI-powered gemstone classification (Sapphire, Ruby, Emerald, etc.).
    *   User authentication and role-based access (User vs. Admin).
    *   Product listing, cart management, and sequential order generation.
    *   Automated transactional email notifications for orders.
    *   Interactive educational guide with detailed gemstone profiles.
*   **Non-Functional Boundaries**:
    *   **Performance**: Sub-100ms AI inference time within the browser.
    *   **Security**: Password hashing via Bcrypt and stateless session management with JWT.
    *   **UI/UX**: Premium "Glassmorphism" aesthetic with mobile-first responsiveness.
    *   **Scalability**: Decoupled MERN architecture (Vite/React frontend and Node/Express backend).

---

## 3. Technology Stack
### Frontend
*   **Framework**: React.js (v18)
*   **Build Tool**: Vite (for rapid HMR)
*   **Language**: TypeScript (Type-safe development)
*   **Styling**: Tailwind CSS & Shadcn/UI (Modern, accessible components)
*   **State Management**: TanStack Query (Server state) & LocalStorage (Persistent state)
*   **Icons**: Lucide-React

### Backend
*   **Environment**: Node.js
*   **Framework**: Express.js
*   **Authentication**: JSON Web Tokens (JWT) & BcryptJS

### Database
*   **Provider**: MongoDB Atlas (Cloud NoSQL)
*   **ODM**: Mongoose

### AI / Machine Learning
*   **Engine**: TensorFlow.js
*   **Models**: MobileNetV2 (Feature Extraction) & KNN Classifier (Dynamic Labeling)

### Cloud/Hosting & Services
*   **Hosting**: Vercel (Frontend & Serverless Backend)
*   **Email**: Nodemailer with Gmail SMTP

---

## 4. Features & Functionalities

| Feature | Description |
| :--- | :--- |
| **AI Recognition Engine** | Uses transfer learning to identify gemstones via camera or upload; includes "Cyber Scan" animations and spectral analysis data. |
| **Marketplace Storefront** | Advanced E-commerce interface with category filtering, price sorting, and "Certified Only" badges. |
| **Admin Dashboard** | Exclusive portal for admins to "Train" the AI by uploading new gemstone activation vectors and labels. |
| **User Authentication** | Secure sign-up/login with role detection; persists user sessions and shopping carts. |
| **Gem Guide (Education)** | Interactive encyclopedia of gemstones with high-definition imagery and technical specifications (Hardness, RI, etc.). |
| **Order Management** | Sequential ID generation for orders with automated HTML email receipts sent to users. |

---

## 5. UI/UX Screenshots
*(Note: Refer to project image assets for actual visuals)*

1.  **Home Page**: Features a premium hero section with high-end typography and call-to-actions for the shop and AI tools.
2.  **AI Identification View**: Displays a "Neural Grid" overlay and vertical laser-scan animation while a gem is being analyzed.
3.  **Marketplace**: A clean, grid-based layout of Gemstones with glassmorphism cards and real-time cart updates.
4.  **Gem Guide**: A list of beautiful gemstones with expandable sections for detailed physical properties.

---

## 6. Challenges & Resolutions

| Challenge | Resolution |
| :--- | :--- |
| **AI Misidentification** | Implemented "Reality Check" logic to detect non-gem objects (people, laptops) and a 100% confidence assurance system for precise matches. |
| **Tensor Memory Leaks** | Utilized `tf.tidy()` in the frontend to automatically dispose of intermediate tensors, preventing browser crashes during repeated scans. |
| **Deployment ID Conflicts** | Developed a custom `counters` collection in MongoDB to ensure atomic incrementing of Order IDs in a serverless environment. |
| **Vercel Ephemeral Storage** | Configured environment variables and external SMTP to ensure email delivery and database connectivity remained stable without local file storage. |

---

## 7. Conclusion
**RoyalStone Lanka** successfully demonstrates the integration of modern web technologies and on-device machine learning to solve real-world problems in the jewelry industry. Key achievements include the creation of a zero-latency AI identification tool and a secure, aesthetic marketplace. The project highlights the power of the MERN stack in building scalable, professional-grade digital ecosystems.

---

## 8. Future Enhancements
*   **Blockchain Integration**: Implementing NFT-based Digital Certificates of Authenticity for every high-value gemstone sold.
*   **AR Try-On**: Integrating Augmented Reality to allow users to virtually "try on" rings and pendants featuring listed gemstones.
*   **Real-time Auctions**: Adding a live bidding system for rare, one-of-a-kind Sri Lankan collector stones.
*   **Multilingual Support**: Providing Tamil and Sinhala translations to better serve the local gem-mining community.
