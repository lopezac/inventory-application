const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res, next) => {
  async.parallel(
    {
      categoryCount(callback) {
        Category.countDocuments({}, callback);
      },
      itemCount(callback) {
        Item.countDocuments({}, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("index", { title: "Inventory App", data: results });
    }
  );
};

exports.category_list = (req, res, next) => {
  Category.find({}).exec((err, categories) => {
    if (err) return next(err);
    res.render("category_list", { title: "Categories", categories });
  });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("category_detail", {
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("name", "Name must no be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
  },
];

exports.category_update_get = (req, res, next) => {
  res.send("implement category update_get");
};

exports.category_update_post = (req, res, next) => {
  res.send("implement category update_post");
};

exports.category_delete_get = (req, res, next) => {
  res.send("implement category delete_get");
};

exports.category_delete_post = (req, res, next) => {
  res.send("implement category delete_post");
};
