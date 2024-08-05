const express = require("express");
const router = express.Router();
const startingController = require("../controllers/startingController");

router.get("/", startingController.createStarting);  

module.exports = router;