import connectDB from '@/lib/mongodb';
import User from '@/models/User';

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        await connectDB();
        console.log('Connected to MongoDB successfully!');

        const userCount = await User.countDocuments();
        console.log(`Current user count: ${userCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
