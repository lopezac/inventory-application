const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

const Category = require("../models/category");
const Item = require("../models/item");

const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/", storage: storage });

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
  upload.single("upload_img"),
  body("name", "Name must no be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description", "Description must be no longer than 600 characters")
    .trim()
    .isLength({ max: 600 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: {
        name: req.file && req.file.originalname,
        fileType: req.file && req.file.mimetype,
        data: req.file && req.file.buffer,
      },
    });
    console.log(req.file);

    if (!errors.isEmpty()) {
      console.log(errors.array(), req.body);
      return res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
    }

    category.save((err) => {
      if (err) return next(err);
      res.redirect(category.url);
    });
  },
];

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) return next(err);
    res.render("category_form", { title: "Update Category", category });
  });
};

exports.category_update_post = [
  upload.single("upload_img"),
  body("name", "Name must no be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("description", "Description must be no longer than 600 characters")
    .trim()
    .isLength({ max: 600 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
      image: {
        name: req.file && req.file.originalname,
        fileType: req.file && req.file.mimetype,
        data: req.file && req.file.buffer,
      },
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category,
        errors: errors.array(),
      });
    }

    Category.findByIdAndUpdate(req.params.id, category, {}, (err) => {
      if (err) return next(err);
      res.redirect(category.url);
    });
  },
];

exports.category_delete_get = (req, res, next) => {
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
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_delete_post = [
  (req, res, next) => {
    Item.find({ category: req.params.id }).exec((err, items) => {
      if (err) return next(err);
      if (items.length == 0) {
        Category.findByIdAndDelete(req.params.id, (err) => {
          if (err) return next(err);
          return res.redirect("/categories");
        });
      } else {
        res.redirect(`/category/${req.params.id}`);
      }
    });
  },
];
