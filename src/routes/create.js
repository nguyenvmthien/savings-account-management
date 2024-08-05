const express = require('express');
const router = express.Router();
const createController = require('../controllers/createController');

router.get('/getInterestRateAPI', createController.get_interest_rate_API);
router.get('/', createController.render_sa_create);
router.post('/', createController.create);

module.exports = router;
