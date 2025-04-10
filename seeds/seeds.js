const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");
require("../config/database");

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: "6239df973d86c4e872b10f5a",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, at maiores dolorem dolore animi temporibus facere iure labore laboriosam veniam alias porro laudantium optio itaque ipsam odit magnam illo ad!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/mangud/image/upload/v1648820815/Yelpcamp/tommy-lisbin-2DH-qMX6M4E-unsplash_rtzewl.jpg",
          filename: "Yelpcamp/qeyircts6xhxapn5ijya",
        },
        {
          url: "https://res.cloudinary.com/mangud/image/upload/v1648820812/Yelpcamp/alfred-boivin-XoM0eYSXWMs-unsplash_loabvh.jpg",
          filename: "Yelpcamp/ngz1dp8q2hjeywwqwceu",
        },
      ],
    });
    await camp.save();
  }
};

// seedDb();
