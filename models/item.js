const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { required: true, type: String },
  price: { required: true, type: Number },
  desc: { required: true, type: String, maxLength: 300 },
  stock: { required: true, type: Number },
  categories: { type: Schema.Types.ObjectId, ref: "Category" },
});

ItemSchema.virtual("url").get(function () {
  return `/items/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
