const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');

router.get('/account', depositController.renderSaDepositAccount);
router.get('/', depositController.renderSaDeposit);
router.post('/', depositController.deposit);

module.exports = router;
