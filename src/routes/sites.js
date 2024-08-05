const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController.js');

router.get('/sa', sitesController.renderSa);
router.get('/contact', sitesController.renderContact);

module.exports = router;