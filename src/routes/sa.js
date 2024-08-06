const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController.js');
const editRouter = require("./edit")
const createRouter = require("./create");

router.use("/edit", editRouter);
router.use("/create", createRouter);
router.get("/", sitesController.renderSa);

module.exports = router;