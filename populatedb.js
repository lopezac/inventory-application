#! /usr/bin/env node

console.log(
  "This script populates some test items, authors, genres and categorys to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
let async = require("async");
let Item = require("./models/item");
let Category = require("./models/category");

let mongoose = require("mongoose");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let items = [];
let categories = [];

function itemCreate(
  name,
  description,
  brand,
  price,
  stock,
  category,
  gamer,
  cb
) {
  let itemdetail = {
    name: name,
    price: price,
    stock: stock,
    category: category,
  };
  if (brand != false) itemdetail.brand = brand;
  if (gamer != false) itemdetail.gamer = gamer;
  if (description != false) itemdetail.description = description;

  let item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      console.log("ERROR CREATING item: " + item);
      return cb(err, null);
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  let categorydetail = { name: name };
  if (description != false) categorydetail.description = description;

  let category = new Category(categorydetail);
  category.save(function (err) {
    if (err) {
      console.log("ERROR CREATING Category: " + category);
      return cb(err, null);
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Xbox Core Wireless Controller - Carbon Black",
          "Experience the modernized design of the Xbox Wireless Controller in Carbon Black, featuring sculpted surfaces and refined geometry for enhanced comfort and effortless control during gameplay with battery usage up to 40 hours.",
          "Microsoft",
          "45",
          "1",
          categories[0],
          true,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "PlayStation DualSense Wireless Controller - Midnight Black ",
          "Bring gaming worlds to life - Feel your in-game actions and environment simulated through haptic feedback*. Experience varying force and tension at your fingertips with adaptive triggers*",
          "Playstation",
          "45",
          "1",
          categories[0],
          true,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Nintendo Switch Pro Controller",
          "Take your game sessions up a notch with the Nintendo Switch Pro Controller ",
          "Nintendo",
          "50",
          "45",
          categories[0],
          true,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Amazon Basics Low-Profile Wired USB Keyboard Matte Black ",
          "Keyboard with low-profile keys for a comfortable, quiet typing experience",
          "Amazon Basics",
          "11",
          "120",
          categories[1],
          false,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "EVGA Z12 RGB Gaming Keyboard 834-W0-12US-KR",
          "IP32-rated spill resistance, capable of withstanding accidental spills to keep you covered.",
          "EVGA",
          "30",
          "25",
          categories[1],
          true,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Logitech MK270 Wireless Keyboard - Black ",
          "Reliable Plug and Play: The USB receiver provides a reliable wireless connection up to 33 ft (1), so you can forget about drop-outs and delays and you can take it wherever you use your computer",
          "Logitech",
          "25",
          "40",
          categories[1],
          false,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Razer DeathAdder Essential Gaming Mouse - Classic Black",
          "High-Precision 6,400 DPI Optical Sensor: Offers on-the-fly sensitivity adjustment through dedicated DPI buttons (reprogrammable) for gaming and creative work",
          "Razer",
          "20",
          "50",
          categories[2],
          true,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "HOTWEEMS Wireless Mouse, D-09 Computer Mouse USB Cordless Mice",
          "Advanced ergonomic computer mouse provides total comfort with 30° ergonomic handshake angel, contoured grips and premium matte finish",
          "HOTWEEMS",
          "10",
          "106",
          categories[2],
          false,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Amazon Basics 3-Button Wired USB Computer Mouse, Black ",
          "Computer mouse for easily navigating a computer interface; click, scroll, and more",
          "Amazon Basics",
          "6",
          "199",
          categories[2],
          false,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Controllers",
          "The best controllers to play for long hours, and excellent for gamers and their consoles or PC's",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Keyboards",
          "The best keyboards, most sensible for your hands.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Mouses",
          "The best mouses, comfy, easy on touch and fast.",
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) console.log("FINAL ERR: " + err);
    else console.log("results of async series: " + results);
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
