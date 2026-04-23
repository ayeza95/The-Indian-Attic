
import mongoose from 'mongoose';
import connectDB from './lib/mongodb';
import Product from './models/Product';
import State from './models/State';
import User from './models/User';

async function verify() {
    console.log('Starting verification from root...');
    try {
        await connectDB();
        console.log('Connected to DB');

        const artisan = await User.findOne({ role: 'artisan' });
        if (!artisan) {
            console.log('Skipping artisan check - no artisan found');
        } else {
            console.log('Artisan found');
        }

        const state = await State.findOne();
        if (!state) console.log('No states found');

        console.log('Creating dummy product...');
        try {
            // Create a dummy product to ensure it validates (no district)
            const p = new Product({
                name: 'Verify District Removal',
                slug: 'verify-district-removal-' + Date.now(),
                description: 'Desc',
                story: 'Story',
                price: 100,
                state: state?._id,
                // No district
                culturalUsage: ['daily_life'],
                culturalContext: 'ctx',
                artisanLineage: 'lin',
                seller: artisan?._id || new mongoose.Types.ObjectId(),
                craftStatus: 'stable',
                craftStatusExplanation: 'exp',
                availabilityType: 'in_stock',
                images: ['url'],
                authenticityTags: ['handmade'] // required field
            });
            await p.validate();
            console.log('Product validation SUCCESS (no district required)');
        } catch (e: any) {
            console.error('Product validation FAILED:', e.message);
            if (e.message.includes('district')) {
                console.error('FATAL: District is still required!');
                process.exit(1);
            }
        }

        // Check if any product has district field populated in query
        const products = await Product.find().limit(1).populate('state');
        if (products.length > 0) {
            const prod: any = products[0];
            if (prod.district) {
                console.error('ALARM: Product retrieved has district field!');
            } else {
                console.log('Product retrieved has NO district field. Clean.');
            }
        }

        console.log('Verification Logic Completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verify();
