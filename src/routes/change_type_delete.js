const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changeTypeController');
const apiController = require('../controllers/apiController');

router.get('/getCurrentTypeAPI', apiController.getCurrentTypeOfSavingAPI);
router.get('/', changeTypeController.renderChangeTypeDelete);
router.post('/', changeTypeController.delete);

module.exports = router;
