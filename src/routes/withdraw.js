const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');
const apiController = require('../controllers/apiController');

router.get('/', withdrawController.renderSaWithraw);
router.post('/', withdrawController.withdraw);
router.get('/getCurrentBalanceAPI', apiController.getCurrentBalanceAPI);

module.exports = router;
