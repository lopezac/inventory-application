const Item = require("../models/item");

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
  res.render("item_form", { title: "Create Item" });
};

exports.item_create_post = (req, res, next) => {
  res.send("implement item create_post");
};

exports.item_update_get = (req, res, next) => {
  res.send("implement item update_get");
};

exports.item_update_post = (req, res, next) => {
  res.send("implement item update_post");
};

exports.item_delete_get = (req, res, next) => {
  res.send("implement item delete_get");
};

exports.item_delete_post = (req, res, next) => {
  res.send("implement item delete_post");
};
