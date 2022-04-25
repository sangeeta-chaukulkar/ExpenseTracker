const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/signup', adminController.postUser);
router.post('/login', adminController.login);

router.post('/expense', adminController.postExpense);
router.get('/expense', adminController.getExpenses);

router.get('/users', adminController.getUsers);
router.post('/userExpenses', adminController.getUserExpenses);



module.exports = router;
