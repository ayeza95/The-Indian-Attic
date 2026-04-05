const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0';

const sampleStates = [
    {
        name: 'Rajasthan',
        slug: 'rajasthan',
        description: 'Land of kings, known for vibrant textiles, jewelry, and handicrafts',
        culturalSignificance: 'Rajasthan is renowned for its rich cultural heritage, including block printing, blue pottery, and traditional jewelry making.',
        image: '/images/states/rajasthan.jpg',
        featured: true,
    },
    {
        name: 'West Bengal',
        slug: 'west-bengal',
        description: 'Home to terracotta art, Kantha embroidery, and traditional sweets',
        culturalSignificance: 'West Bengal has a rich tradition of arts and crafts, particularly known for Dokra metal casting and Baluchari sarees.',
        image: '/images/states/west-bengal.jpg',
        featured: true,
    },
    {
        name: 'Kerala',
        slug: 'kerala',
        description: 'Gods own country, famous for spices, coir products, and Kathakali masks',
        culturalSignificance: 'Kerala is known for its traditional crafts including bell metal utensils, coconut shell crafts, and handloom textiles.',
        image: '/images/states/kerala.jpg',
        featured: true,
    },
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const StateSchema = new mongoose.Schema({
            name: String,
            slug: String,
            description: String,
            culturalSignificance: String,
            image: String,
            featured: Boolean,
        });

        const State = mongoose.models.State || mongoose.model('State', StateSchema);

        console.log('Clearing existing states...');
        await State.deleteMany({});

        console.log('Inserting sample states...');
        await State.insertMany(sampleStates);

        const count = await State.countDocuments();
        console.log(`Successfully inserted ${count} states`);

        console.log('\nSample data:');
        const states = await State.find({});
        states.forEach(state => {
            console.log(`- ${state.name} (${state.slug})`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
