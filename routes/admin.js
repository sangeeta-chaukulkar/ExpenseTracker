const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.post('/signup', adminController.postUser);
router.post('/login', adminController.login);

router.post('/expense', authMiddleware.authenticate,adminController.postExpense);
router.get('/expense', authMiddleware.authenticate,adminController.getexpenses);
router.get('/download', authMiddleware.authenticate,adminController.downloadexpense);


router.get('/getuser/:id', adminController.getUser);
router.get('/leaderboard', adminController.getleaderboard);


router.patch('/updateExpense/:expenseid', adminController.updateExpense);
router.get('/getExpenset/:threshold/:items_per_page',authMiddleware.authenticate, adminController.getExpenset);


router.get('/download',authMiddleware.authenticate,adminController.downloadexpense)
router.use('/forgotpassword', adminController.forgotpassword)

router.delete('/deleteexpense/:expenseid', authMiddleware.authenticate, adminController.deleteexpense)


module.exports = router;
