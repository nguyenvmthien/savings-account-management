const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');
const apiController = require('../controllers/apiController');

router.get('/account', editController.renderSaEditAccount);
router.get('/checkID', apiController.getInformationAPI);
router.get('/', editController.renderSaEdit);
router.post('/account', editController.edit);

module.exports = router;
