const ExpressError = require('./utils/ExpressError') // this is for defining our custom error messages
const {campgroundSchema,reviewSchema} =require('./schema')  // Joi validations
const Campground = require('./models/campground')    // this is our basic structure of campgrounds
const Review = require('./models/review')



// middleware to protect the routes
// also telling if we are signed in or not

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...',req.user);  // req.user automatically stores the information of the user wheather he/she is logged in or not and many other i.e = id,username,email
    // store the url they are requesting 
    req.session.returnTo =req.originalUrl;
    if (!req.isAuthenticated()) {     // isauthenticated is a passport middleware to keep routes protected
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// for storing the previous url we were visiting before being redirected to login page

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// validating campgrounds 
module.exports.validateCampground = (req, res, next) => {   // its validations are in schema.js
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// validating reviews
module.exports.validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    } 
}



// conforming if you are the author of campground before deleteting it
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;  // here it finds the id from the url
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// conforming if you are the author of review before deleteting it and you are signed it
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


