const express = require('express');
const { scanForLeaks, getSummary, getLeaksTable} = require('../controllers/inputControllers');
const router = express.Router();


router.route('/scan').post(scanForLeaks);
router.route('/summary').get(getSummary);
router.route('/leaks').get(getLeaksTable)


module.exports = router;