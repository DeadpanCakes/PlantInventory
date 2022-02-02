const async = require("async");

const Item = require("../models/item");
const Category = require("../models/category");

//Create
exports.getNew = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) next(err);
    res.render("itemForm", {
      title: "New Item",
      item: {},
      categories,
      action: "/items/new",
    });
  });
};
exports.postNew = (req, res, next) => {
  Item.findOne({ name: req.body.itemName }).exec((err, existingItem) => {
    if (err) next(err);
    if (existingItem) {
      res.redirect(existingItem.url);
    } else {
      const itemDetails = {
        name: req.body.itemName,
        desc: req.body.itemDesc,
        price: req.body.itemPrice,
        stock: req.body.itemStock,
        categories: req.body.category,
      };
      console.log(req.body.itemName, " ", itemDetails);
      const newItem = new Item(itemDetails);
      newItem.save((err, item) => {
        if (err) next(err);
        res.redirect(item.url);
      });
    }
  });
  //res.send("Push new item to db, redirect to that page");
};

//Read
exports.getList = (req, res, next) => {
  Item.find().exec((err, items) => {
    res.render("itemList", { title: "All Items", items });
  });
};
exports.getItem = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("categories")
    .exec((err, item) => {
      if (err) next(err);
      console.log(item);
      res.render("itemDetails", { title: item.name, item });
    });
};

//Update
exports.getUpdate = (req, res, next) => {
  async.parallel(
    {
      item: (cb) => {
        Item.findById(req.params.id).exec(cb);
      },
      categories: (cb) => {
        Category.find().exec(cb);
      },
    },
    (err, results) => {
      if (err) next(err);
      const { item, categories } = results;
      res.render("itemForm", {
        title: `Updating ${item.name}`,
        item,
        categories,
        action: `/items/update/${item._id}`,
      });
    }
  );
};
exports.postUpdate = (req, res, next) => {
  Category.findById(req.body.category).exec((err, category) => {
    console.log(req.body);
    if (err) next(err);
    const itemDetails =  {
      name: req.body.itemName,
      desc: req.body.itemDesc,
      price: req.body.itemPrice,
      stock: req.body.itemStock,
      categories: category,
    };
    Item.findByIdAndUpdate(req.params.id, itemDetails).exec((err, item) => {
      if (err) next(err);
      res.redirect(item.url);
    });
  });
  //res.send("Make new model, push to db, redirect to that page");
};

//Delete
exports.getDelete = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) next(err);
    res.render("itemDeletion", { title: `Delete ${item.name}?`, item });
  });
  //res.send("Find by id, render confirmation page");
};
exports.postDelete = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id).exec((err) => {
    res.redirect("/items");
  });
  // res.send(
  //   "Find by id and delet, redner page confirming delete, then redirect to item list"
  // );
};
