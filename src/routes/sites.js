const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController.js');

router.get('/contact', sitesController.renderContact);
router.get('/home', sitesController.renderHome);
router.get('/starting', sitesController.renderStarting);

module.exports = router;