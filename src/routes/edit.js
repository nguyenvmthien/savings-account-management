const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');
const apiController = require ('../controllers/apiController');

router.get("/account", editController.renderSaEditAccount);
router.post("/", apiController.getInformationAPI); 
router.get("/", editController.renderSaEdit);
router.put("/", editController.edit);

module.exports = router;