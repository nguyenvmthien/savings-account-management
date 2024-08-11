const express = require('express');
const router = express.Router();
const analyzeDailyController = require('../controllers/analyzeDailyController');
const apiController = require('../controllers/apiController');

router.get('/createReportAPI', apiController.createReportDailyAPI);
router.get('/', analyzeDailyController.renderSaAnalyzeDaily);

module.exports = router;
