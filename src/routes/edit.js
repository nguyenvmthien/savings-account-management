const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');

router.get("/account", editController.renderEditAccount);
router.post("/", editController.getInformation); 
router.get("/", editController.renderEdit);

module.exports = router;