const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');


const router = express.Router();

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)


module.exports = router;