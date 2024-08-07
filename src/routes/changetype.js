const express = require('express');
const router = express.Router();
const changeTypeEditRouter = require("./change_type_edit");
const changeTypeCreateRouter = require("./change_type_create");

router.use("/create", changeTypeCreateRouter);
router.use("/edit", changeTypeEditRouter);

module.exports = router;