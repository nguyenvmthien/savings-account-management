const express = require('express');
const router = express.Router();
const change_type_edit_Controller = require('../controllers/changetypeEditController');

router.get("/edit", change_type_edit_Controller.renderChangeTypeEdit);

module.exports = router;