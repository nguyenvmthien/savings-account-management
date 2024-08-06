const express = require('express');
const router = express.Router();
const changetypecreateController = require('../controllers/change_type_createController');


router.get("/", changetypecreateController.render_adjusted_create);

module.exports = router;