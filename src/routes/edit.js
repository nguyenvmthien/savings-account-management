const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');

router.get("/", editController.renderEdit);
router.get("/edit-account", editController.renderEditAccount)

module.exports = router;