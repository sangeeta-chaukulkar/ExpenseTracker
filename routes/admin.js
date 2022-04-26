const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/signup', adminController.postUser);
router.post('/login', adminController.login);

router.post('/expense', adminController.postExpense);
router.get('/expense', adminController.getExpenses);

router.get('/users', adminController.getUsers);
router.get('/userExpenses', adminController.getUserExpenses);
router.post('/userExpensess', adminController.getUserExpensess);

router.get('/download',authMiddleware.authenticate,adminController.downloadexpense)
router.use('/forgotpassword', adminController.forgotpassword)


module.exports = router;
