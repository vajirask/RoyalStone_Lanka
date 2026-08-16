import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://royalstone:roylstone1234@royalai.ftgyfay.mongodb.net/?appName=RoyalAI';

const TrainingDataSchema = new mongoose.Schema({
    gemType: String,
    imagePath: String,
    activationData: [Number],
    createdAt: { type: Date, default: Date.now }
});

const TrainingData = mongoose.model('TrainingData', TrainingDataSchema);

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const count = await TrainingData.countDocuments();
        const samples = await TrainingData.find({}, 'gemType').limit(5);
        console.log('--- DATABASE CHECK ---');
        console.log('Total Training Samples:', count);
        console.log('Recent Gem Types Trained:', samples.map(s => s.gemType).join(', '));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
