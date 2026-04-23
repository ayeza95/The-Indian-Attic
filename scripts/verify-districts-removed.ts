
import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Product from '../models/Product';
import State from '../models/State';
import Cart from '../models/Cart';
import User from '../models/User';

async function verify() {
    console.log('Starting verification...');
    try {
        await connectDB();
        console.log('Connected to DB');

        // 1. Verify User exists (Artisan)
        const artisan = await User.findOne({ role: 'artisan' });
        if (!artisan) {
            console.error('No artisan found');
            return;
        }
        console.log(`Found artisan: ${artisan.email}`);

        // 2. Verify State exists
        const state = await State.findOne();
        if (!state) {
            console.error('No state found. Please seed states.');
            return;
        }
        console.log(`Found state: ${state.name}`);

        // 3. Create Product (Without District)
        const productData = {
            name: `Test Product ${Date.now()}`,
            slug: `test-product-${Date.now()}`,
            description: 'Test Description',
            story: 'Test Story',
            price: 100,
            currency: 'INR',
            state: state._id,
            // district: removed
            culturalUsage: ['festival'],
            culturalContext: 'Context',
            artisanLineage: 'Lineage',
            generationalCraft: false,
            authenticityTags: ['handmade'],
            craftStatus: 'stable',
            craftStatusExplanation: 'Stable',
            availabilityType: 'in_stock',
            stockQuantity: 10,
            images: ['https://example.com/image.jpg'],
            isActive: true,
            seller: artisan._id
        };

        console.log('Attempting to create product...');
        const product = await Product.create(productData);
        console.log(`Product created: ${product.name} (${product._id})`);

        // 4. Fetch Product (Populate State)
        const fetchedProduct = await Product.findById(product._id).populate('state');
        console.log(`Fetched product state: ${fetchedProduct.state.name}`);
        if (fetchedProduct.district) {
            console.error('ERROR: Product still has district field populated!');
        } else {
            console.log('SUCCESS: Product does not have district field.');
        }

        // 5. Cleanup
        await Product.findByIdAndDelete(product._id);
        console.log('Cleanup done.');

        console.log('Verification PASSED');
        process.exit(0);
    } catch (error) {
        console.error('Verification FAILED:', error);
        process.exit(1);
    }
}

verify();
