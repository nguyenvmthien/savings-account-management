const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const apiController = require('../controllers/apiController');

router.get('/getCurrentTypeAPI', apiController.getCurrentTypeOfSavingAPI);
router.get('/getMinDepMoneyAPI', apiController.getMinDepMoneyAndMinWithDaysAPI);
router.get('/checkID', apiController.getInformationAPI);
router.get('/account', depositController.renderSaDepositAccount);
router.get('/', depositController.renderSaDeposit);
router.post('/account', depositController.deposit);

module.exports = router;
