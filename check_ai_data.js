import mongoose from 'mongoose';

const SRV_URI = 'mongodb+srv://vajirask249_db_user:zKKIu8O3HRSg1uU2@cluster0.nx1ewgq.mongodb.net/royalstone?retryWrites=true&w=majority&appName=Cluster0';
const DIRECT_URI = 'mongodb://vajirask249_db_user:zKKIu8O3HRSg1uU2@ac-lexrp1j-shard-00-00.nx1ewgq.mongodb.net:27017,ac-lexrp1j-shard-00-01.nx1ewgq.mongodb.net:27017,ac-lexrp1j-shard-00-02.nx1ewgq.mongodb.net:27017/royalstone?ssl=true&replicaSet=atlas-g1quo5-shard-0&authSource=admin&retryWrites=true&w=majority';

const TrainingDataSchema = new mongoose.Schema({
    gemType: String,
    imagePath: String,
    activationData: [Number],
    createdAt: { type: Date, default: Date.now }
});

const TrainingData = mongoose.model('TrainingData', TrainingDataSchema);

async function check() {
    console.log('Testing connection to MongoDB Atlas...');
    let connected = false;

    // Try direct URI first for maximum reliability across network DNS providers
    try {
        console.log('1. Trying Direct ReplicaSet connection...');
        await mongoose.connect(DIRECT_URI, { serverSelectionTimeoutMS: 6000, tls: true, tlsAllowInvalidCertificates: true });
        console.log('✅ Direct ReplicaSet connected successfully!');
        connected = true;
    } catch (e1) {
        console.warn('Direct connection failed:', e1.message);
        try {
            console.log('2. Trying SRV connection...');
            await mongoose.connect(SRV_URI, { serverSelectionTimeoutMS: 6000 });
            console.log('✅ SRV connection successful!');
            connected = true;
        } catch (e2) {
            console.error('❌ SRV connection also failed:', e2.message);
        }
    }

    if (!connected) {
        process.exit(1);
    }

    const count = await TrainingData.countDocuments();
    const gemTypes = await TrainingData.distinct('gemType');
    console.log('\n=======================================');
    console.log('💎 GEMSTONE AI TRAINING DATA IN DATABASE');
    console.log('=======================================');
    console.log(`Total Samples: ${count}`);
    console.log(`Trained Gem Types: ${gemTypes.join(', ')}`);
    for (const gt of gemTypes) {
        const c = await TrainingData.countDocuments({ gemType: gt });
        console.log(`   • ${gt}: ${c} sample(s)`);
    }
    console.log('=======================================\n');
    process.exit(0);
}

check();
