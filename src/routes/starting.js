const express = require("express");
const router = express.Router();
const Starting = require("../controllers/StartingController");

router.get("/", Starting.createStarting);  

module.exports = router;