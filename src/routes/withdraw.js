const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');
const apiController = require('../controllers/apiController');

router.get('/account', withdrawController.renderSaWithdrawAccount)
router.get('/', withdrawController.renderSaWithdraw);
router.post('/account', withdrawController.withdraw);
router.post('/', apiController.getInformationAPI);
router.get('/getCurrentBalanceAPI', apiController.getCurrentBalanceAPI);

module.exports = router;
