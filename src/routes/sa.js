const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController.js');
const editRouter = require("./edit")

router.use("/edit", editRouter);
router.get("/", sitesController.renderSa);

module.exports = router;