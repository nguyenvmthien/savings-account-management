const express = require('express');
const router = express.Router();
const createController = require('../controllers/createController');

router.get('/getInterestRateAPI', createController.getInterestRateAPI);
router.get('/', createController.renderSaCreate);
router.post('/', createController.create);

module.exports = router;
