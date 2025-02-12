if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express=require('express');
const app=express();
const path =require('path');
const mongoose = require('mongoose');
const methodoveride = require('method-override')    // this is for a put/patch request when submitting the form 
const ejsMate = require('ejs-mate')   // for setting layout to our routes
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError') // this is for defining our custom error messages
// const Joi = require('joi');  // this will validate data before saving it to the mongoose , ==>> we dont need it here as we are expoting it form schema.js
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');  //  to prevent MongoDB Operator Injection
const helmet = require('helmet')
const MongoStore = require('connect-mongo');


const userRoutes = require('./routes/users')   // for users routes
const campgroundsRoutes = require('./routes/campgrounds')  // for campground route
const reviewsRoutes = require('./routes/reviews');   // for review route
const { StringDecoder } = require('string_decoder');


const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/Yelpcamp';




// mongoose.connect('mongodb://127.0.0.1:27017/Yelpcamp')
mongoose.connect(dbUrl)
.then(()=>{
    console.log("CONNECTION OPEN")
})
.catch(err=>{
    console.log("oh no error")
    console.log(err)
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));   // this is for parsing the body
app.use(methodoveride('_method'));   // using the method override
app.use(express.static(path.join(__dirname,'public')));  // to serve our public file
// app.use(mongoSanitize());  //  to prevent MongoDB Operator Injection
// Or, to replace these prohibited characters with _, use:
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );


  // for mongo storage

  const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisisasecret'
    }
});

store.on('error',function(e){
console.log('Session store error',e)
})

// session
const sessionConfig={
    store,
    name:'session',   // it gives another name to connect.sid
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true, // this will not allow us to be logged in in local , as it works only on https whereas local is http
        expires: Date.now() + 1000*60*60*24*7,  // get 1 week
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// security form helmet
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drgvcd4hu/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// passport 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// setting a middleware for session message  and these are avaible in every file by using local
app.use((req,res,next)=>{
// here telling the route to return to its original url
// if(!['/login','/'].includes(req.originalUrl)){
//     req.session.returnTo =req.originalUrl;
// }

    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// creating a new user

// app.get('/fakeuser',async (req,res)=>{
//     const user =new User({email:'tim@gmail.com',username:'tim'});
//     const newUser = await User.register(user,'chicken');   // here we put the password == chicken is the password
//     res.send(newUser)
// })

// specifying routes
app.use('/',userRoutes);    // prefix with noting
app.use('/campgrounds',campgroundsRoutes);  // prefix with campgrounds
app.use('/campgrounds/:id/reviews',reviewsRoutes);   // prefix with /campgrounds/:id/reviews
  

app.get('/', (req, res) => {
    res.render('home')
});





app.get('/',(req,res)=>{
    res.send('HELLO FROM YELP CAMP')
})


app.all('*',(req,res,next)=>{    // THIS will run for every request (all)(get,put,post,delete) and for every route (*) . if none of the above matches so it must come in last
    // res.send('404 ERROR')
    next(new ExpressError('PAGE NOT FOUND',404))
})


// defining errors
// app.use((err,req,res,next)=>{
//     res.send('OH BOY WE GOT A ERROR')
// })

// app.use((err,req,res,next)=>{
//     const {statuscode = 500 , message='something went wrong'} = err;   // this is to provide default
//     res.status(statuscode).render('error')   // rendering the error template && passing error to show the error stack to
// })

app.use((err,req,res,next)=>{
    const {statuscode = 500 } = err;  
    if(!err.message) err.message = 'Oh no something went wrong ' 
    res.status(statuscode).render('error',{err})   
})



app.listen(3000,()=>{
    console.log('SERVING YOUR APP')
});
