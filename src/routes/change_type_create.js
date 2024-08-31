const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changeTypeController');
const apiController = require('../controllers/apiController');

router.get('/getCurrentTypeAPI', apiController.getCurrentTypeOfSavingAPI);
router.get('/', changeTypeController.renderChangeTypeCreate);
router.post('/', changeTypeController.create);

module.exports = router;
