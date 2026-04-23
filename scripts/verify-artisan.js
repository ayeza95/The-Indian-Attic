const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0';

async function verifyArtisan() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String,
            isActive: Boolean,
            verificationStatus: String,
            businessName: String,
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const result = await User.updateOne(
            { email: 'art@mail' },
            {
                $set: {
                    verificationStatus: 'verified',
                    isActive: true
                }
            }
        );

        console.log('Update result:', result);

        const user = await User.findOne({ email: 'art@mail' });
        console.log('\nUser details:');
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Verification Status:', user.verificationStatus);
        console.log('Active:', user.isActive);

        await mongoose.connection.close();
        console.log('\nDone! You can now login.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyArtisan();
