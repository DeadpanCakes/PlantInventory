const async = require("async");

const Category = require("../models/category");
const Item = require("../models/item");

//Create
exports.getNew = (req, res, next) => {
  res.render("categoryForm", {
    title: "New Category",
    category: {},
    action: "/categories/new",
  });
};
exports.postNew = (req, res, next) => {
  Category.findOne({ name: req.body.categoryName }).exec(
    (err, existingCategory) => {
      if (err) next(err);
      if (existingCategory) {
        res.redirect(existingCategory.url);
      } else {
        const newCategory = new Category({ name: req.body.categoryName });
        newCategory.save((err) => {
          if (err) next(err);
          res.redirect(newCategory.url);
        });
      }
    }
  );
};

//Read
exports.getList = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) next(err);
    res.render("categoryList", { title: "Categories", categories });
  });
};
exports.getCategory = (req, res, next) => {
  async.parallel(
    {
      category: (cb) => {
        Category.findById(req.params.id).exec(cb);
      },
      items: (cb) => {
        Item.find({ categories: { $in: { _id: req.params.id } } }).exec(cb);
      },
    },
    (err, results) => {
      const { category, items } = results;
      if (err) return next(err);
      res.render("categoryDetails", {
        title: category.name,
        category: category,
        items: items,
      });
    }
  );
};

//Update
exports.getUpdate = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) next(err);
    res.render("categoryForm", { title: `Update ${category.name}`, category });
  });
};
exports.postUpdate = (req, res, next) => {
  Category.findByIdAndUpdate(req.params.id, {
    name: req.body.categoryName,
  }).exec((err, category) => {
    if (err) next(err);
    res.redirect(category.url);
  });
  //res.send("Make new model, push to db, redirect to that page");
};

//Delete
exports.getDelete = (req, res, next) => {
  async.parallel(
    {
      category: (cb) => Category.findById(req.params.id).exec(cb),
      items: (cb) => {
        Item.find({ categories: { $in: { _id: req.params.id } } }).exec(cb);
      },
    },
    (err, results) => {
      if (err) next(err);
      res.render("categoryDeletion", {
        title: `Delete ${results.category.name}?`,
        category: results.category,
        items: results.items,
        canBeDeleted: results.items.length <= 0
      });
    }
  );
  //res.send("Find by id, render confirmation page");
};
exports.postDelete = (req, res, next) => {
  Category.findByIdAndDelete(req.params.id).exec((err) => {
    if(err) next(err);
      res.redirect("/categories")
  })
  // res.send(
  //   "Find by id and delet, redner page confirming delete, then redirect to category list"
  // );
};
