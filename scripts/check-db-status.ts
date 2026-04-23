import connectDB from './lib/mongodb';
import State from './models/State';


async function checkDB() {
    try {
        await connectDB();
        const stateCount = await State.countDocuments();

        const states = await State.find().limit(10);


        console.log('Database Status:');
        console.log(`States: ${stateCount}`);


        console.log('\nSample States:');
        states.forEach(s => console.log(`- ${s.name} (${s._id})`));



        process.exit(0);
    } catch (error) {
        console.error('Error checking DB:', error);
        process.exit(1);
    }
}

checkDB();
