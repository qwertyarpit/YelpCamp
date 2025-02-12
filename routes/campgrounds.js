const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campground');
const {storage} = require('../cloudinary')  // i dont need to include index as node automatically look for index.js files in a folder


const multer  = require('multer')
const upload = multer({  storage })  // store file in the storage that we defined in index.js of cloudniary


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))  // upload the images using middleware upload.array is a middeware and image is the name we gave to file in html 


// .post(upload.array('image'),(req,res)=>{
// console.log(req.body,req.files);  // req.file stores all thr information of the file // files for multiple files and image for a single file
// res.send('IT WORKED')
// })


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')          // chaning the similar routes
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;











// const Campground = require('../models/campground')    // this is our basic structure of campgrounds
// const catchAsync = require('../utils/catchAsync')   // helper function/utils for the async functions
// const ExpressError = require('../utils/ExpressError') // this is for defining our custom error messages
// const {campgroundSchema} =require('../schema')  // Joi validations
// const {isLoggedIn,validateCampground,isAuthor} = require('../middleware')




// const express =require('express');
// const router = express.Router();






// router.get('/', async (req,res)=>{  
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index',{campgrounds});  // passing and rendering it
// });

// // creating a new campground

// router.get('/new',isLoggedIn,(req,res)=>{  // isLoggedIn is the middleware to protect the specific route
//     res.render('campgrounds/new')
// })

// // using try and catch when creating a new campground with invalid price
// // app.post('/campgrounds', async(req,res,next)=>{
// //     // res.send(req.body);
// //     try{
// //     const campground =  new Campground(req.body.campground);
// //    await campground.save();
// //    res.redirect(`campgrounds/${campground._id}`)
// //     } catch (e) {
// // next(e);
// //     }
// // })


// // now we dont have to put this is try and catch as above we can directly use our catchAsync function 
// router.post('/',isLoggedIn,validateCampground , catchAsync(async(req,res,next)=>{
// // if(!req.body.campground) throw new ExpressError('INVALID CAMPGROUND DATA',400)  // THIS is a type of client side validation if someone tries to submit data throught postman
//     const campground =  new Campground(req.body.campground);
//     campground.author = req.user._id;  // storing the campground author also
//    await campground.save();
//    req.flash('success','Sucessfully made a new campground')   // flashing the message of creating a campground
//    res.redirect(`campgrounds/${campground._id}`)
// }))




// // getting a specific campground
// // id will be below as otherwise in campground/new => here new is treated as a id
// router.get('/:id', catchAsync(async(req,res)=>{
//     const campground =await Campground.findById(req.params.id).populate({
//         path:'reviews',
//         populate:{
//             path:'author'
//         }
//     }).populate('author');  // finding the campground with the required id  &&& and using populate to convert the data from object id to values && taking its author also tell its author
// //   console.log(campground);
// if(!campground){
//     req.flash('error','Cant find that campground')   // if we cant find the campground with that specific id (i.e) it has been deleted and we still want to access it
//     return res.redirect('/campgrounds');
// }
//     res.render('campgrounds/show' , {campground});
// }))

// // edit and update

// router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(async(req,res)=>{
//     const {id} = req.params;  
//     const campground = await Campground.findById(id)
//     if(!campground){
//         req.flash('error','Cant find that campground')   
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', {campground});    // without passing the {campground} we will get error saying its not defined
// }));

// router.put('/:id',validateCampground,isLoggedIn ,isAuthor, catchAsync(async (req,res)=>{
//     // res.send('IT WORKED')
//     const {id} = req.params;
//     // Campground.findByIdAndUpdate(id,{title:'maqwe' , location:'qwert'})  // can hardcore bythisway
//     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});  // as we have title and location in campground
//     req.flash('success','Successfully updated campground')  // displaying flash message
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// // deleting 

// router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req,res)=>{
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash('success','Successfully deleted campground')
//     res.redirect('/campgrounds')
// }))



// module.exports = router;

