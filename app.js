const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing');

const app = express();

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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

// Test route to create a sample listing
// app.get('/testlistings', async (req, res) => {
//     let newListing = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing description.",
//         price: 100,
//         location: "Sample Location",
//         country: "Sample Country"
//     });
//     await newListing.save();
//     console.log("New listing saved");
//     res.send('Listings will be displayed here');
// });

// List all listings - Index Route
app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
});

// Form to create new listing - New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Show details of a specific listing - Show Route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
});

// Create a new listing - Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect(`/listings`);
});

// Form to edit a listing - Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});

// Update a listing - Update Route
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/listings/${id}`);
});

// Delete a listing - Delete Route
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});