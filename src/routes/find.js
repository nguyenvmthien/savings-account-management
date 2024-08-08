const express = require('express');
const router = express.Router();
const findAccountController = require('../controllers/findAccountController');

router.get('/createReportAPI', findAccountController.createReportAPI);
router.get('/', findAccountController.renderSaFindAccount);

module.exports = router;