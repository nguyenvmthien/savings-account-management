const express = require('express');
const router = express.Router();
const createController = require('../controllers/createController');
const apiController = require('../controllers/apiController');

router.get('/getNewestIDAccountAPI', apiController.getNewestIDAccountAPI);
router.get('/getcurTypeAPI', apiController.getCurrentTypeOfSavingAPI);
router.get('/getInterestRateAPI', apiController.getInterestRateAPI);
router.get('/', createController.renderSaCreate);
router.post('/', createController.create);

module.exports = router;
