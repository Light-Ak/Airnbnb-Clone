const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejs = require('ejs');
const Listing = require('./models/listing');

const app = express();

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const mongo_url = "mongodb://127.0.0.1:27017/airbnb";
async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

app.get('/listings', async (req, res) => {
    let newListing = new Listing({
        title: "Sample Listing",
        description: "This is a sample listing description.",
        price: 100,
        location: "Sample Location",
        country: "Sample Country"
    });
    await newListing.save();
    console.log("New listing saved");
    res.send('Listings will be displayed here');
});