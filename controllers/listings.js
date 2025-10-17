const Listing = require('../models/listing');

// List all listings - Index Route
module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}

// Form to create new listing - New Route
module.exports.createNewListingForm = (req, res) => {
    res.render("listings/new");
}

// Show details of a specific listing - Show Route
module.exports.showAllListings = async (req, res) => {
    const { id } = req.params;
    // populate reviews so you get actual data, not just ObjectIds
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" }  // populate the author inside each review
    })
    .populate("owner"); // populate the listing owner
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// Create a new listing - Create Route
module.exports.createNewListing = async (req, res) => {
    
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing); // ✅ expects nested listing
    newListing.owner = req.user._id; // set the owner to the logged-in user
    // newListing.image = {url, filename}; // set the image url and filename
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect("/listings");
}

// Form to edit a listing - Edit Route
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}

// Update a listing - Update Route
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Find the listing first
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { runValidators: true, new: true }
    );

    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${updatedListing._id}`);
}

// Delete a listing - Delete Route
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing');
    res.redirect("/listings");
}