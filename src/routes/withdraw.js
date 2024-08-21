const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');
const apiController = require('../controllers/apiController');

router.get('/getCurrentBalanceAPI', apiController.getCurrentBalanceAPI);
router.get('/getMinWitDaysAPI', apiController.getMinDepMoneyAndMinWithDaysAPI);
router.get('/checkID', apiController.getInformationAPI);
router.get('/account', withdrawController.renderSaWithdrawAccount);
router.get('/', withdrawController.renderSaWithdraw);
router.post('/account', withdrawController.withdraw);

module.exports = router;
