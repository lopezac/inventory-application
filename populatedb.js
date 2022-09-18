#! /usr/bin/env node

console.log(
  "This script populates some test items, authors, genres and categorys to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

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

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  let categorydetail = {
    book: book,
    imprint: imprint,
  };
  if (due_back != false) categorydetail.due_back = due_back;
  if (status != false) categorydetail.status = status;

  var category = new Category(categorydetail);
  category.save(function (err) {
    if (err) {
      console.log("ERROR CREATING Category: " + category);
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categorys.push(category);
    cb(null, book);
  });
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        bookCreate(
          "The Name of the Wind (The Kingkiller Chronicle, #1)",
          "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
          "9781473211896",
          authors[0],
          [genres[0]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate(
          items[0],
          "London Gollancz, 2014.",
          false,
          "Available",
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createItems, createCategories],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("categorys: " + categorys);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
