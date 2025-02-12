const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;

























// const catchAsync = require('../utils/catchAsync')   // helper function/utils for the async functions
// const ExpressError = require('../utils/ExpressError') // this is for defining our custom error messages
// // const {reviewSchema} =require('../schema')  // Joi validations
// const Campground = require('../models/campground')    // this is our basic structure of campgrounds
// const Review = require('../models/review')   // this is for creating the new review
// const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')



// const express =require('express');
// const router =express.Router({mergeParams:true});  // to acesss id here also ==> error ==> cant read property null






// // submitting reviews
// router.post('/',validateReview,isLoggedIn,catchAsync(async(req,res)=>{
//     // res.send('hey there')
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);  // it is review[body] and review[rating]
//     review.author=req.user._id;   // giving id of user
//     campground.reviews.push(review);  // as defined in models/campground
//     await review.save();
//     await campground.save();
//     req.flash('success','Created new review')
//     res.redirect(`/campgrounds/${campground._id}`)
// }))


// // // deleting review
// // app.delete('/campgrounds/:id/reviews/reviewId',catchAsync(async(req,res)=>{
// //     const { id , reviewId} = req.params;
// //     await Campground.findByIdAndUpdate(id , { $pull: { reviews: reviewId}});  // pull operator delete a specific id from an array ==> that is removing a id from object array matching the review id   ==>>>> here we are pulling from reviews array with review id
// //     await Review.findByIdAndDelete(reviewId);  // review id as in the path/route
// //     // res.send('i am being deleting')
// //     res.redirect(`/campgrounds/${id}`);
// // }))

// router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash('success','Successfully deleted review')
//     res.redirect(`/campgrounds/${id}`);
// }))


// module.exports = router;