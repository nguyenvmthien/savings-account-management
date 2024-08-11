const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController');
const dailyRouter = require('./daily');
const monthlyRouter = require('./monthly');
const findRouter = require('./find');

router.use('/daily-report', dailyRouter);
router.use('/monthly-report', monthlyRouter);
router.use('/find-account', findRouter);
router.get('/', sitesController.renderAnalysis);

module.exports = router;
