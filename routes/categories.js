const express = require("express");
const router = express.Router();

//Create
router.get("/new", (req, res, next) => {
  res.send("Form For Creating Categories");
});

router.post("/new", (req, res, next) => {
  res.send("Make a new category, push to server, redirect to that page");
});

//Read
router.get("/", (req, res, next) => {
  res.send("Display a list of all items");
});
router.get("/:id", (req, res, next) => {
  res.send("Find by id, display info of item");
});

//Update
router.get("/update/:id", (req, res, next) => {
  res.send(
    "find by id, display same form as for new categories, but prepopulate fields"
  );
});
router.post("/update/:id", (req, res, next) => {
  res.send("Find and update by id, redirect to page");
});

//Delete
router.get("/delete/:id", (req, res, next) => {
  res.send("display simple yes/no form for confirming delete, display info");
});
router.post("/delete/:id", (req, res, next) => {
  res.send(
    "display brief confirmation that the delete has gone through before redirecting to list of categories"
  );
});

module.exports;
