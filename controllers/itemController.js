const Item = require("../models/item");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.item_list = (req, res, next) => {
  Item.find({}).exec((err, items) => {
    if (err) return next(err);
    res.render("item_list", { title: "Items", items });
  });
};

exports.item_detail = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec((err, item) => {
      if (err) return next(err);
      res.render("item_detail", { title: item.name, item });
    });
};

exports.item_create_get = (req, res, next) => {
  Category.find({}).exec((err, categories) => {
    if (err) return next(err);
    res.render("item_form", { title: "Create Item", categories });
  });
};

exports.item_create_post = [
  body("name", "Name must no be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description", "Description must be no longer than 600 characters")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 600 })
    .escape(),
  body("category", "Select a valid category")
    // .trim()
    .isLength({ min: 1 }),
  // .escape(),
  body("brand", "Brand must be shorter than 100 characters")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock can't be smaller than 0")
    .trim()
    .isLength({ min: 0 })
    .escape(),
  body("price", "Price must be greater than 0")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("gamer").optional({ checkFalsy: true }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      stock: req.body.stock,
      price: req.body.price,
      gamer: req.body.gamer ? true : false,
    });

    if (!errors.isEmpty()) {
      Category.find({}).exec((err, categories) => {
        if (err) return next(err);
        res.render("item_form", {
          title: "Create Item",
          categories,
          item,
          errors: errors.array(),
        });
      });
    }

    item.save((err) => {
      if (err) return next(err);
      res.redirect(item.url);
    });
  },
];

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find({}).exec(callback);
      },
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("item_form", {
        title: "Update Item",
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

exports.item_update_post = [
  body("name", "Name must no be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description", "Description must be no longer than 600 characters")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 600 })
    .escape(),
  body("category", "Select a valid category")
    // .trim()
    .isLength({ min: 1 }),
  // .escape(),
  body("brand", "Brand must be shorter than 100 characters")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock can't be smaller than 0")
    .trim()
    .isLength({ min: 0 })
    .escape(),
  body("price", "Price must be greater than 0")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("gamer").optional({ checkFalsy: true }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      stock: req.body.stock,
      price: req.body.price,
      gamer: req.body.gamer ? true : false,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Category.find({}).exec((err, categories) => {
        if (err) return next(err);
        res.render("item_form", {
          title: "Update Item",
          categories,
          item,
          errors: errors.array(),
        });
      });
    }

    Item.findByIdAndUpdate(req.params.id, item, {}, (err) => {
      if (err) return next(err);
      res.redirect(item.url);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) return next(err);
    res.render("item_delete", { title: "Delete Item", item });
  });
};

exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/items");
  });
};
