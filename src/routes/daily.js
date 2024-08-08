const express = require('express');
const router = express.Router();
const analyzeDailyController = require('../controllers/analyzeDailyController');

router.get('/createReportAPI', analyzeDailyController.createReportAPI);
router.get('/', analyzeDailyController.renderSaAnalyzeDaily);

module.exports = router;