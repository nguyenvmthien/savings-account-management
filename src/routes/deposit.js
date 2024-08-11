const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const apiController = require('../controllers/apiController');

router.get('/account', depositController.renderSaDepositAccount);
router.get('/', depositController.renderSaDeposit);
router.post('/account', depositController.deposit);
router.post('/', apiController.getInformationAPI);
router.get('/getCurrentPrincipalAPI', apiController.getCurrentPrincipalAPI);

module.exports = router;
