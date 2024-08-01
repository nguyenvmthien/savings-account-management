const express = require('express');
const router = express.Router();
const createController = require('../controllers/createController');

router.use('/', createController.index);

module.exports = router;
