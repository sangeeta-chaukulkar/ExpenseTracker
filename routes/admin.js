const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/signup', adminController.postUser);
router.post('/login', adminController.login);

router.post('/expense', authMiddleware.authenticate,adminController.postExpense);
router.get('/expense', authMiddleware.authenticate,adminController.getexpenses);

router.get('/dailyexpenses', authMiddleware.authenticate,adminController.getDailyexpenses);
router.get('/weeklyexpenses', authMiddleware.authenticate,adminController.getWeeklyexpenses);
router.get('/getmonthlyexpenses', authMiddleware.authenticate,adminController.getMonthlyexpenses);

router.get('/download', authMiddleware.authenticate,adminController.downloadexpense);


router.get('/users', adminController.getUsers);

router.get('/userExpenses/:userid', adminController.getUserExpenses);
// router.post('/userExpensess', adminController.getUserExpensess);
router.get('/getexpense/:items_per_page',authMiddleware.authenticate, adminController.getExpense);
router.get('/getuserexpense/:userid/:items_per_page', adminController.getUserExpense);

router.get('/download',authMiddleware.authenticate,adminController.downloadexpense)
router.use('/forgotpassword', adminController.forgotpassword)

router.delete('/deleteexpense/:expenseid', authMiddleware.authenticate, adminController.deleteexpense)


module.exports = router;
