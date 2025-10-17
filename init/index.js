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

    const listings = initdata.data.map(listing => {
        let imageObj;

        if (typeof listing.image === 'string') {
            // If image is a string URL
            imageObj = {
            url: listing.image,
            filename: listing.image.split('/').pop()
            };
        } else if (typeof listing.image === 'object' && listing.image !== null) {
            // If image is already an object with url & filename
            imageObj = {
            url: listing.image.url,
            filename: listing.image.filename
            };
        } else {
            // Default/fallback in case no image provided
            imageObj = {
            url: '',
            filename: ''
            };
        }

        return {
            ...listing,
            image: imageObj,
            owner: "68f02c050e827eba43309489"
        };
        });


    await Listing.insertMany(listings);
    console.log("Database initialized with sample data");
    mongoose.connection.close();
};


initDB();