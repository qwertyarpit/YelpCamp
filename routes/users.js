const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')   // chaning the similar routes
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;































// const express =require('express')
// const router = express.Router()
// const User = require('../models/user')
// const catchAsync = require('../utils/catchAsync')
// const passport = require('passport')
// const { storeReturnTo } = require('../middleware');



// // this is for registering

// router.get('/register',(req,res)=>{
//     res.render('users/register')
// })

// router.post('/register',catchAsync(async(req,res)=>{
//     // res.send(req.body);
//     try{   // doing try and catch to catch error and redirect to login page only
//     const {email,username,password}  = req.body;  // getting these three things form form
//     const user =new User({email,username});
//     const registeredUser = await User.register(user,password);
//     // logging user after registering in using login passport helper function 
//     req.login(registeredUser,err =>{
//         if(err)  return next(err);
//         // console.log(registeredUser);
//     req.flash('success','Welcome to Yelpcamp');
//     res.redirect('/campgrounds');
//     })

//     }
//     catch (e){
//         req.flash('error',e.message);
//         res.redirect('register')
//     }
// }));



// // this is for login


// router.get('/login',(req,res)=>{
//     res.render('users/login')
// });


// // router.post('/login',passport.authenticate('local',{failureFlash:true , failureRedirect:'/login'}),(req,res)=>{    // passport.authenticate is middleware from passport
// // req.flash('success','Welcome back');
// // const redirectUrl =req.session.returnTo || '/campgrounds';  // storing where the user was before redirecting to login page and || when user directlly login
// // delete req.session.returnTo;  // deleting the path which was stored
// // res.redirect(redirectUrl)
// // });

// router.post('/login',
//     // use the storeReturnTo middleware to save the returnTo value from session to res.locals
//     storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),(req, res) => {  // Now we can use res.locals.returnTo to redirect the user after login
//         req.flash('success', 'Welcome back!');
//         const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
//         res.redirect(redirectUrl);
//     });



// // this is for logout

// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/campgrounds');
//     });
// }); 


// module.exports = router;