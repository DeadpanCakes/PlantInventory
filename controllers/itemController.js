const async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.postNew = [
  body("itemName", "Item Name Required").trim().isLength({ min: 1 }).escape(),
  body("itemDesc")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Item Description Required")
    .isLength({ max: 300 })
    .withMessage("Item Description Too Long (Max 300 Characters"),
  body("itemPrice", "Item Price Required").trim().isLength({ min: 1 }),
  body("itemPrice", "Item Price Must Be A Number")
    .trim()
    .custom((value) => !isNaN(value))
    .escape(),
  body("itemStock", "Item Stock Required").trim().isLength({ min: 1 }),
  body("itemStock", "Item Stock Must Be A Number")
    .trim()
    .custom((value) => !isNaN(value))
    .escape(),
  body("category", "Item Category Required")
    .escape()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);
    async.parallel(
      {
        categories: (cb) => Category.find().exec(cb),
        existingItem: (cb) =>
          Item.findOne({ name: req.body.itemName }).exec(cb),
      },
      (err, results) => {
        const { categories, existingItem } = results;

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
          const newItem = new Item(itemDetails);

          if (!errors.isEmpty()) {
            res.render("itemForm", {
              title: "New Item",
              item: itemDetails,
              categories,
              action: "/items/new",
              errors: errors.array(),
            });
          } else {
            newItem.save((err, item) => {
              if (err) next(err);
              res.redirect(item.url);
            });
          }
        }
      }
    );
  },
];

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
exports.postUpdate = [
  body("itemName", "Item Name Required").trim().isLength({ min: 1 }).escape(),
  body("itemDesc")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Item Description Required")
    .isLength({ max: 300 })
    .withMessage("Item Description Too Long (Max 300 Characters"),
  body("itemPrice", "Item Price Required").trim().isLength({ min: 1 }),
  body("itemPrice", "Item Price Must Be A Number")
    .trim()
    .custom((value) => !isNaN(value))
    .escape(),
  body("itemStock", "Item Stock Required").trim().isLength({ min: 1 }),
  body("itemStock", "Item Stock Must Be A Number")
    .trim()
    .custom((value) => !isNaN(value))
    .escape(),
  body("category", "Item Category Required")
    .escape()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const itemDetails = {
      name: req.body.itemName,
      desc: req.body.itemDesc,
      price: req.body.itemPrice,
      stock: req.body.itemStock,
    };
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: (cb) => Category.find().exec(cb),
          item: (cb) => Item.findById(req.params.id).exec(cb),
        },
        (err, results) => {
          if (err) next(err);
          res.render("itemForm", {
            title: `Updating ${results.item.name}`,
            item: itemDetails,
            categories: results.categories,
            action: `/items/update/${results.item._id}`,
            errors: errors.array()
          });
        }
      );
    } else {
      Category.findById(req.body.category).exec((err, category) => {
        if (err) next(err);
        itemDetails.categories = category;
        Item.findByIdAndUpdate(req.params.id, itemDetails).exec((err, item) => {
          if (err) next(err);
          res.redirect(item.url);
        });
      });
    }
  },
];

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
