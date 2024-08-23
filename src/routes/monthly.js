const express = require('express');
const router = express.Router();
const analyzeMonthlyController = require('../controllers/analyzeMonthlyController');
const apiController = require('../controllers/apiController');

router.get('/createReportAPI', apiController.createReportMonthlyAPI);
router.get('/getTypeAPI', apiController.getCurrentTypeOfSavingAPI);
router.get('/', analyzeMonthlyController.renderSaAnalyzeMonthly);

module.exports = router;
