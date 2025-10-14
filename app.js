const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');

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

// LISTING ROUTES
app.use('/listings', listingRoutes);

// REVIEW ROUTES
app.use('/listings/:id/reviews', reviewRoutes);

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs",{message,status});
    // res.status(status).send(message);
});