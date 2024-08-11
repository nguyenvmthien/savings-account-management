const express = require('express');
const router = express.Router();
const changeTypeController = require('../controllers/changeTypeController');
const changeTypeEditRouter = require('./change_type_edit');
const changeTypeCreateRouter = require('./change_type_create');
const changeTypeDeleteRouter = require('./change_type_delete');

router.use('/create', changeTypeCreateRouter);
router.use('/edit', changeTypeEditRouter);
router.use('/delete', changeTypeDeleteRouter);
router.get('/', changeTypeController.renderChangeType);

module.exports = router;
