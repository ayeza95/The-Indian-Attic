import connectDB from './lib/mongodb';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';

async function checkData() {
    await connectDB();

    // Find all artisans
    const artisans = await User.find({ role: 'artisan' }).lean();
    console.log('--- Artisans ---');
    artisans.forEach(a => {
        console.log(`ID: ${a._id}, Name: ${a.name}, Role: ${a.role}`);
    });

    for (const artisan of artisans) {
        console.log(`\nChecking products for ${artisan.name} (${artisan._id}):`);
        const products = await Product.find({ seller: artisan._id }).lean();
        console.log(`Found ${products.length} products.`);
        products.forEach(p => {
            console.log(`- Product: ${p.name}, State: ${p.state}`);
        });
    }

    // Find all buyers
    const buyers = await User.find({ role: 'buyer' }).lean();
    console.log('\n--- Buyers ---');
    buyers.forEach(b => {
        console.log(`ID: ${b._id}, Name: ${b.name}, Role: ${b.role}`);
    });

    for (const buyer of buyers) {
        console.log(`\nChecking orders for ${buyer.name} (${buyer._id}):`);
        const orders = await Order.find({ buyer: buyer._id }).lean();
        console.log(`Found ${orders.length} orders.`);
    }

    process.exit(0);
}

checkData();
