const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changeTypeController');

router.get("/", changeTypeController.renderChangeTypeEdit);

module.exports = router;