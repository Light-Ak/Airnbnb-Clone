const Review = require('../models/review');
const Listing = require('../models/listing');

// Create a new review for a listing
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id; // ✅ correct field

  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();

  req.flash('success', 'Created new review!');
  res.redirect(`/listings/${id}`);
}

// Delete a review from a listing
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // Remove the review document
    await Review.findByIdAndDelete(reviewId);
    // Also remove the reference from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/listings/${id}`);
}