const express = require('express');
const router = express.Router();
const findAccountController = require('../controllers/findAccountController');
const apiController = require('../controllers/apiController');

router.get('/createReportAPI', apiController.findAccountAPI);
router.get('/', findAccountController.renderSaFindAccount);

module.exports = router;
