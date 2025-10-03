const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const mongo_url = "mongodb://127.0.0.1:27017/airbnb";
async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    // Map image field to just the URL string
    const listings = initdata.data.map(listing => ({
        ...listing,
        image: listing.image.url
    }));
    await Listing.insertMany(listings);
    console.log("Database initialized with sample data");
    mongoose.connection.close();
};

initDB();