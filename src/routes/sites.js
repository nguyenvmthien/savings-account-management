const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController.js');
const apiController = require('../controllers/apiController.js');

router.get('/contact', sitesController.renderContact);
router.get('/home/getChartData', apiController.getAllAndWithdrawTransactionAPI);
router.get('/home', sitesController.renderHome);
router.get('/starting', sitesController.renderStarting);
router.get('/', sitesController.renderDefault);

module.exports = router;
