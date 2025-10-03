const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/400",
        set: (v) => v==="" ? "https://via.placeholder.com/400" : v,
    },
    price: Number,
    location: String,
    country : String,
});

module.exports = mongoose.model('Listing', listingSchema);