const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

//Create
router.get("/new", categoryController.getNew);

router.post("/new", categoryController.postNew);

//Read
router.get("/", categoryController.getList);
router.get("/:id", categoryController.getCategory);

//Update
router.get("/update/:id", categoryController.getUpdate);
router.post("/update/:id", categoryController.postUpdate);

//Delete
router.get("/delete/:id", categoryController.getDelete);
router.post("/delete/:id", categoryController.postDelete);

module.exports;
