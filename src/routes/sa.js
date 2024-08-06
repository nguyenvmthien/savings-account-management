const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController');
const editRouter = require("./edit")
const createRouter = require("./create");
const depositRouter = require("./deposit");
const withdrawRouter = require("./withdraw");

router.use("/create", createRouter);
router.use("/edit", editRouter);
router.use("/deposit", depositRouter);
router.use("/withdraw", withdrawRouter);
router.get("/", sitesController.renderSa);

module.exports = router;