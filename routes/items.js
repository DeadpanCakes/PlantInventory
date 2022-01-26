const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");

//Create
router.get("/new", itemController.getNew);
router.post("/new", itemController.postNew);

//Read
router.get("/", itemController.getList);
router.get("/:id", itemController.getItem);

//Update
router.get("/update/:id", itemController.getUpdate);
router.post("/update/:id", itemController.postUpdate);

//Delete
router.get("/delete/:id", itemController.getDelete);
router.post("/delete/:id", itemController.postDelete);

module.exports = router;
