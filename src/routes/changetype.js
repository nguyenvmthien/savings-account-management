const express = require('express');
const router = express.Router();
const changeTypeCreateController = require('../controllers/changeTypeCreateController');


router.get("/create", changeTypeCreateController.renderChangeTypeCreate);

module.exports = router;