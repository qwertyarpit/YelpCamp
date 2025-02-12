const mongoose = require('mongoose');
const Review = require('./review');  // for deleting reviews along with campgrounds

const Schema = mongoose.Schema;   // using this otherwsie for short form

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
     url: String,
     filename: String
 });
 
 ImageSchema.virtual('thumbnail').get(function () {
     return this.url.replace('/upload', '/upload/w_200');  // replacing upload with upload/w_200 for setting its width to 200 . Given in docs
 });

 const opts = { toJSON: { virtuals: true } };

const Campgroundschema = new Schema({
     title:String,
     images:[ImageSchema],
     geometry: {    // storing geodata as said in mongoose docs
          type: {
              type: String,
              enum: ['Point'],
              required: true
          },
          coordinates: {
              type: [Number],
              required: true
          }
      },
     price:Number,
     description:String,
     location:String,
     author:{
          type: Schema.Types.ObjectId,
          ref: 'User'
     },
     reviews: [
          {
               type: Schema.Types.ObjectId,
               ref:'Review'
          }
     ]
}, opts);

Campgroundschema.virtual('properties.popUpMarkup').get(function () {
          return `
          <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
          <p>${this.description.substring(0, 20)}...</p>`
});

// setting up mongoose middleware and deleting reviews also when deleting campground
// doc== it is the campground that was deleted
Campgroundschema.post('findOneAndDelete',async function (doc){
     // console.log('deleted');
     // console.log(doc)
     if(doc){
          await Review.deleteMany({   // removing all associated with the particular campground
               _id:{
                    $in:doc.reviews
               }
          })
     }
})



module.exports = mongoose.model('Campground',Campgroundschema); 