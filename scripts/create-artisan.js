const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0';

async function createArtisan() {
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

        // Check if user exists
        const existingUser = await User.findOne({ email: 'art@mail' });
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            console.log('Role:', existingUser.role);
            console.log('Verification Status:', existingUser.verificationStatus);
            console.log('Active:', existingUser.isActive);
            await mongoose.connection.close();
            return;
        }

        // Create new artisan
        const hashedPassword = await bcrypt.hash('123456', 12);

        const artisan = await User.create({
            name: 'Test Artisan',
            email: 'art@mail',
            password: hashedPassword,
            role: 'artisan',
            isActive: true,
            verificationStatus: 'verified',
            businessName: 'Traditional Crafts',
        });

        console.log('Artisan created successfully!');
        console.log('Email:', artisan.email);
        console.log('Role:', artisan.role);
        console.log('Verification Status:', artisan.verificationStatus);

        await mongoose.connection.close();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createArtisan();
