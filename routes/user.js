const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const { userSchema } = require('../schema');
const passport = require('passport');


// Middleware to validate user data
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Register a new user - Register Route
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

// Handle user registration
router.post('/signup', validateUser, wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;  
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Airbnb!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

// Render login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle user login
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// Handle user logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', "Logged Out!");
        res.redirect('/listings');
    });
});

module.exports = router;