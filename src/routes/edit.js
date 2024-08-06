const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');

router.get("/account", editController.renderSaEditAccount);
router.post("/", editController.getInformationAPI); 
router.get("/", editController.renderSaEdit);

module.exports = router;