const mongoose = require('mongoose');
const dotenv = require('dotenv')
const fs = require('fs')
require('colors');

// model
const Product = require('../../models/Product');

dotenv.config({ path: './config.env' });

// db local
const db = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongouri = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// MongoDB connection
mongoose.connect(mongouri)
    .then(() => console.log(`Connected to MongoDB → ${mongouri}`.gray.bold))
    .catch((err) => console.log(`Could not connect to MongoDB → ${err}`.red.bold));

// read JSON file
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Product.insertMany(products);
        console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
        process.exit();
    } catch (e) {
        console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'.red.bold);
        console.log(e);
        process.exit();
    }
};

// delete data from database
const deleteData = async () => {
    try {
        console.log('😢😢 Goodbye Data...');
        await Product.deleteMany();
        console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green.bold);
        process.exit();
    } catch (e) {
        console.log(e);
        process.exit();
    }
};

if (process.argv.includes('--delete')) {
    deleteData();
} else {
    importData();
}
