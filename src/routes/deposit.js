const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const apiController = require('../controllers/apiController');

router.get('/account', depositController.renderSaDepositAccount);
router.get('/', depositController.renderSaDeposit);
router.post('/', depositController.deposit);
router.get('/getCurrentPrincipalAPI', apiController.getCurrentPrincipalAPI);

module.exports = router;
