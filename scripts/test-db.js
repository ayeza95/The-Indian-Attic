const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB Atlas!');
        console.log('Database:', mongoose.connection.db.databaseName);
        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
