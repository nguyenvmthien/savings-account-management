const express = require('express');
const router = express.Router();
const withdrawController = require('../controllers/withdrawController');

router.get('/', withdrawController.renderSaWithraw);
router.post('/', withdrawController.withdraw);

module.exports = router;
