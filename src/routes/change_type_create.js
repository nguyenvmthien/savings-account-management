const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changetypeController');

router.get('/', changeTypeController.renderChangeTypeCreate);

module.exports = router;
