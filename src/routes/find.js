const express = require('express');
const router = express.Router();
const findAccountController = require('../controllers/findAccountController');
const apiController = require('../controllers/apiController');

router.get('/createReportAPI', apiController.findAccountAPI);
router.get('/getNewestAccountAPI', apiController.getLatestAccountsAPI);
router.get('/getTypeAPI', apiController.getAllTypeOfSavingAPI);
router.get('/', findAccountController.renderSaFindAccount);

module.exports = router;
