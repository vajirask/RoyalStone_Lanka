
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auth Imports
// Auth Imports
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const JWT_SECRET = process.env.JWT_SECRET || 'royalstone_secret_key_123';
const EMAIL_USER = process.env.EMAIL_USER || 'vajirask249@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'crtu wfmb ebqi dkku';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vajirask249_db_user:zKKIu8O3HRSg1uU2@cluster0.nx1ewgq.mongodb.net/royalstone?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists - wrapped in try-catch for read-only filesystems (Vercel)
const uploadDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
} catch (e) {
    console.warn("Could not create uploads directory (expected on Vercel):", e.message);
}

// Multer setup for file uploads
// Use memory storage for serverless (Vercel), disk storage for local/Render
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
let upload;
if (isServerless) {
    upload = multer({ storage: multer.memoryStorage() });
} else {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    upload = multer({ storage });
}

// Default connection string from env
const DEFAULT_MONGO_URI = MONGO_URI;

// MongoDB Connection Caching for Serverless
let isConnected = false;
let cachedConnection = null;

const connectDB = async (uri) => {
    // If we already have a connection, use it
    if (isConnected && mongoose.connection.readyState === 1) {
        return true;
    }

    const targetUri = uri || process.env.MONGODB_URI || DEFAULT_MONGO_URI;

    try {
        console.log("Attempting MongoDB connection (Optimized)...");

        // In serverless, we reuse the connection promise if it exists
        if (!cachedConnection || mongoose.connection.readyState === 0) {
            cachedConnection = mongoose.connect(targetUri, {
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                tls: true,
                tlsAllowInvalidCertificates: true
            });
        }

        await cachedConnection;
        isConnected = true;
        console.log('✅ MongoDB Connected');
        seedUsers();
        return true;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        isConnected = false;
        cachedConnection = null;
        return false;
    }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Models
const TrainingDataSchema = new mongoose.Schema({
    gemType: String,
    imagePath: String,
    activationData: [Number], // Store tensor data as array
    createdAt: { type: Date, default: Date.now }
});

const IdentificationSchema = new mongoose.Schema({
    predictedGemType: String,
    confidence: Number,
    allPredictions: Array,
    imagePath: String,
    createdAt: { type: Date, default: Date.now }
});

const TrainingData = mongoose.model('TrainingData', TrainingDataSchema);
const Identification = mongoose.model('Identification', IdentificationSchema);

// User Model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Order Model
// Counter Schema for Auto-Incrementing Order IDs
const CounterSchema = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

// Order Model
const OrderSchema = new mongoose.Schema({
    orderId: { type: Number, unique: true }, // Incremental ID (1, 2, 3...)
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    town: { type: String, required: true },
    identityNumber: { type: String, required: true },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Seeding Function
const seedUsers = async () => {
    try {
        const adminEmail = 'admin@royalstone.com';
        const userEmail = 'user@royalstone.com';

        let adminExists = await User.findOne({ email: adminEmail });
        const salt = await bcrypt.genSalt(10);
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            }).save();
            console.log('Sample Admin Created: admin@royalstone.com / admin123');
        } else {
            const isMatch = await bcrypt.compare('admin123', adminExists.password);
            if (!isMatch || adminExists.role !== 'admin') {
                adminExists.password = await bcrypt.hash('admin123', salt);
                adminExists.role = 'admin';
                await adminExists.save();
                console.log('Updated existing admin account password and role');
            }
        }

        let userExists = await User.findOne({ email: userEmail });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash('user123', salt);
            await new User({
                name: 'Sample User',
                email: userEmail,
                password: hashedPassword,
                role: 'user'
            }).save();
            console.log('Sample User Created: user@royalstone.com / user123');
        } else {
            const isMatch = await bcrypt.compare('user123', userExists.password);
            if (!isMatch) {
                userExists.password = await bcrypt.hash('user123', salt);
                await userExists.save();
                console.log('Updated existing demo user account password');
            }
        }
    } catch (err) {
        console.error('Seeding Error:', err.message);
    }
};

// Routes

// Check MongoDB Status
app.get('/api/mongodb/status', (req, res) => {
    res.json({ connected: isConnected });
});

// Connect to MongoDB (custom URI)
app.post('/api/mongodb/connect', async (req, res) => {
    const { connectionString } = req.body;
    const success = await connectDB(connectionString);
    if (success) {
        res.json({ success: true, message: 'Connected successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Connection failed' });
    }
});

// In-memory fallback for training data
const memoryTrainingStore = [];

// Save Training Data
app.post('/api/training/save', upload.single('image'), async (req, res) => {
    try {
        const { gemType, activationData } = req.body;
        const imagePath = req.file ? req.file.filename : null;
        const parsedActivation = activationData ? (typeof activationData === 'string' ? JSON.parse(activationData) : activationData) : [];

        const newTrainingData = new TrainingData({
            gemType,
            imagePath,
            activationData: parsedActivation
        });

        let savedData = null;
        if (isConnected) {
            savedData = await newTrainingData.save();
        } else {
            savedData = {
                _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                gemType,
                imagePath,
                activationData: parsedActivation,
                createdAt: new Date()
            };
            memoryTrainingStore.push(savedData);
        }

        res.json({ success: true, message: 'Training data saved', data: savedData });
    } catch (error) {
        console.error("Save Training Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Existing Training Activation
app.post('/api/training/save-activation', async (req, res) => {
    try {
        const { id, activationData } = req.body;
        if (isConnected) {
            await TrainingData.findByIdAndUpdate(id, { activationData });
            res.json({ success: true, message: 'Activation updated' });
        } else {
            const item = memoryTrainingStore.find(m => m._id === id);
            if (item) item.activationData = activationData;
            res.json({ success: true, message: 'Memory activation updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save Identification Result
app.post('/api/identification/save', upload.single('image'), async (req, res) => {
    try {
        const { predictedGemType, confidence, allPredictions } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        const newIdentification = new Identification({
            predictedGemType,
            confidence: parseFloat(confidence),
            allPredictions: allPredictions ? JSON.parse(allPredictions) : [],
            imagePath
        });

        if (isConnected) {
            await newIdentification.save();
        }
        res.json({ success: true, message: 'Identification result saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Recent Identifications
app.get('/api/identification/recent', async (req, res) => {
    try {
        if (isConnected) {
            const recent = await Identification.find().sort({ createdAt: -1 }).limit(10);
            return res.json({ success: true, data: recent });
        }
        res.json({ success: true, data: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Training Stats
app.get('/api/training/stats', async (req, res) => {
    try {
        if (isConnected) {
            const stats = await TrainingData.aggregate([
                { $group: { _id: "$gemType", count: { $sum: 1 } } }
            ]);
            const formattedStats = stats.map(s => ({ gemType: s._id, count: s.count }));
            return res.json({ success: true, data: { byGemType: formattedStats } });
        }

        const counts = {};
        memoryTrainingStore.forEach(m => { counts[m.gemType] = (counts[m.gemType] || 0) + 1; });
        const formattedStats = Object.entries(counts).map(([gemType, count]) => ({ gemType, count }));
        res.json({ success: true, data: { byGemType: formattedStats } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get All Training Data (for AI Model Initialization)
app.get('/api/training/all', async (req, res) => {
    try {
        if (isConnected) {
            const allData = await TrainingData.find({}, 'gemType activationData imagePath');
            return res.json({ success: true, data: allData });
        }
        res.json({ success: true, data: memoryTrainingStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Clear All Training Data
app.post('/api/training/clear', async (req, res) => {
    try {
        if (isConnected) {
            await TrainingData.deleteMany({});
        }
        memoryTrainingStore.length = 0;
        res.json({ success: true, message: 'All training data cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Training Data for a Specific Gem
app.post('/api/training/delete-gem', async (req, res) => {
    try {
        const { gemType } = req.body;
        if (!gemType) {
            return res.status(400).json({ success: false, message: 'Gem type is required' });
        }
        if (isConnected) {
            await TrainingData.deleteMany({ gemType });
        }
        for (let i = memoryTrainingStore.length - 1; i >= 0; i--) {
            if (memoryTrainingStore[i].gemType === gemType) {
                memoryTrainingStore.splice(i, 1);
            }
        }
        res.json({ success: true, message: `Training data for "${gemType}" deleted` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Authentication Section ---

// Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!isConnected) {
            return res.status(503).json({ success: false, message: 'Database disconnected' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: req.body.role || 'user'
        });

        await newUser.save();

        // Create token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!isConnected) {
            return res.status(503).json({ success: false, message: 'Database disconnected' });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// Create Order
// Create Order
// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        if (!isConnected) {
            return res.status(503).json({ success: false, message: 'Database disconnected' });
        }

        // Get and increment the order counter
        let counter = await Counter.findOne({ id: 'orderId' });
        if (!counter) {
            counter = new Counter({ id: 'orderId', seq: 0 });
            await counter.save();
        }

        // Increment sequence
        const seq = counter.seq + 1;
        await Counter.updateOne({ id: 'orderId' }, { $set: { seq } });

        // Create new order with sequential ID
        const newOrder = new Order({
            ...req.body,
            orderId: seq
        });

        const savedOrder = await newOrder.save();
        console.log(`✅ Order #${savedOrder.orderId} saved to database for ${savedOrder.fullName}`);

        // Send Email Notification
        console.log("📧 Starting email notification process...");
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                },
                debug: true, // Enable debug output
                logger: true // Log information to console
            });

            const mailOptions = {
                from: EMAIL_USER,
                to: EMAIL_USER,
                subject: `💎 New Order Received: #${savedOrder.orderId} - ${savedOrder.fullName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #1a365d; text-align: center;">New Order Received!</h1>
                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="margin-top: 0; color: #2d3748;">Order Information</h2>
                            <p><strong>Order ID:</strong> #${savedOrder.orderId}</p>
                            <p><strong>Date:</strong> ${new Date(savedOrder.createdAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span style="text-transform: uppercase; color: #d69e2e; font-weight: bold;">${savedOrder.status}</span></p>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <h3 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Customer Details</h3>
                            <p><strong>Name:</strong> ${savedOrder.fullName}</p>
                            <p><strong>Email:</strong> ${savedOrder.email}</p>
                            <p><strong>Phone:</strong> ${savedOrder.mobileNumber}</p>
                            <p><strong>Identity (NIC/Passport):</strong> ${savedOrder.identityNumber}</p>
                            <p><strong>Address:</strong><br>${savedOrder.address},<br>${savedOrder.town}</p>
                        </div>
                       
                        <div style="margin-bottom: 20px;">
                            <h3 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Items Ordered</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #edf2f7; text-align: left;">
                                        <th style="padding: 10px; border: 1px solid #e2e8f0;">Item</th>
                                        <th style="padding: 10px; border: 1px solid #e2e8f0;">Qty</th>
                                        <th style="padding: 10px; border: 1px solid #e2e8f0;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${savedOrder.items.map(item => `
                                        <tr>
                                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${item.name}</td>
                                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${item.quantity}</td>
                                            <td style="padding: 10px; border: 1px solid #e2e8f0;">$${item.price.toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; text-align: right;">
                            <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${savedOrder.subtotal.toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Shipping:</strong> $${savedOrder.shipping.toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Tax (1%):</strong> $${savedOrder.tax.toLocaleString()}</p>
                            <hr style="border: none; border-top: 1px solid #cbd5e0;">
                            <h2 style="margin: 5px 0; color: #2c5282;">Total Amount: $${savedOrder.totalAmount.toLocaleString()}</h2>
                        </div>
                        
                        <p style="font-size: 12px; color: #718096; text-align: center; margin-top: 30px;">
                            RoyalStone Lanka - Secure Gemplate Marketplace Administration
                        </p>
                    </div>
                `
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Order notification email sent: ' + info.response);
        } catch (emailError) {
            console.error('CRITICAL EMAIL ERROR:', emailError);
            // Don't fail the request if email fails, just log it
        }

        res.json({ success: true, message: 'Order placed successfully', orderId: savedOrder.orderId });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ------------------------------

// Serve frontend static files in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback: serve index.html for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
    console.log('📦 Serving frontend from:', distPath);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
