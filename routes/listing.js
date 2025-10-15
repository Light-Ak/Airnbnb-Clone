const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');

// Middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// List all listings - Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}));

// Form to create new listing - New Route
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// Show details of a specific listing - Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    // populate reviews so you get actual data, not just ObjectIds
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));


// Create a new listing - Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing); // ✅ expects nested listing
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect("/listings");
}));


// Form to edit a listing - Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

// Update a listing - Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    // req.body.listing contains the updated fields
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,       // ✅ use the nested object
        { runValidators: true, new: true } // return updated document
    );

    req.flash('success', 'Successfully updated listing!');

    if (!updatedListing) {
        throw new ExpressError("Listing not found", 404);
    }

    res.redirect(`/listings/${id}`);
}));


// Delete a listing - Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing');
    res.redirect("/listings");
}));

module.exports = router;