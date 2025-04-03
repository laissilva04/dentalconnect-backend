const express = require('express');
const router = express.Router();
const mailController = require('../controllers/MailController');


router.post('/forgot-password', mailController.forgotPassword);

module.exports = router;
