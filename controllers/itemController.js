const Item = require("../models/item");

//Create
exports.getNew = (req, res, next) => {
  res.send("Render empty item form");
};
exports.postNew = (req, res, next) => {
  res.send("Push new item to db, redirect to that page");
};

//Read
exports.getList = (req, res, next) => {
  res.send("Find render list of items");
};
exports.getItem = (req, res, next) => {
  res.send("Find by id, display info");
};

//Update
exports.getUpdate = (req, res, next) => {
  res.send("Find by id and render item form pre-populated");
};
exports.postUpdate = (req, res, next) => {
  res.send("Make new model, push to db, redirect to that page");
};

//Delete
exports.getDelete = (req, res, next) => {
  res.send("Find by id, render confirmation page");
};
exports.postDelete = (req, res, next) => {
  res.send(
    "Find by id and delet, redner page confirming delete, then redirect to item list"
  );
};
