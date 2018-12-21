const express = require('express');
const router = express.Router();
const VerifyToken = require('../../controllers/auth/verify');
const controller = require('../../controllers/auth/auth-controller');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/me', VerifyToken, controller.me);

module.exports = router;
