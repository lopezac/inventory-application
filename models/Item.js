const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 1 },
  description: {
    type: String,
    maxLength: 500,
    // minLength: 1,
  },
  brand: { type: String, maxLength: 100 },
  price: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
  gamer: { type: Boolean },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
