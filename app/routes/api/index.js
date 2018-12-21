const express = require('express');
const router = express.Router();

const authRouter = require('./api-auth-router');
const userRouter = require('./user-api-router');
const meRouter = require('./me-api-router');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/me', meRouter);

module.exports = router;
