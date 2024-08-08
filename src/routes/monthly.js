const express = require('express');
const router = express.Router();
const analyzeMonthlyController = require('../controllers/analyzeMonthlyController');

router.get('/createReportAPI', analyzeMonthlyController.createReportAPI);
router.get('/', analyzeMonthlyController.renderSaAnalyzeMonthly);

module.exports = router;