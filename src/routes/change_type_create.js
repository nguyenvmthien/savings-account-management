const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changeTypeController');

router.get("/", changeTypeController.renderChangeTypeCreate);
router.post("/", changeTypeController.create);

module.exports = router;