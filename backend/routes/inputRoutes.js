const express = require('express');
const { scanForLeaks } = require('../controllers/inputControllers');
const router = express.Router();


router.route('/scan').post(scanForLeaks);



module.exports = router;