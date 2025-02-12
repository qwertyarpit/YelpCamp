const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');  // importing seeds helpers
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/Yelpcamp')
.then(()=>{
    console.log("CONNECTION OPEN")
})
.catch(err=>{
    console.log("oh no error")
    console.log(err)
})

const sample = array => array[Math.floor(Math.random() * array.length)];  // inline async function

// making only one we get

// const seedDB = async ()=>{
//     await Campground.deleteMany({});
//     const c =new Campground({ title:'sunset view'});
//     await c.save();
// }

// seedDB();


const seedDB = async () => {
    await Campground.deleteMany({});   // delting all the previous data in mongoose
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64a7c8137c07e418d3869713',  // this is our user id
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/drgvcd4hu/image/upload/v1688823733/Yelpcamp/zdgeeagwkwxebfiowt3k.jpg',
                  filename: 'Yelpcamp/zdgeeagwkwxebfiowt3k',
                },
                {
                  url: 'https://res.cloudinary.com/drgvcd4hu/image/upload/v1688823734/Yelpcamp/wa61vgahitxk9fifrsaa.jpg',
                  filename: 'Yelpcamp/wa61vgahitxk9fifrsaa',
                }
              ]
        })
        await camp.save();  // saving it to the database
    }
}

seedDB().then(() => {
    mongoose.connection.close();  // closing the database after seeding it
})


// to seed the database ==> node seeds/index.js