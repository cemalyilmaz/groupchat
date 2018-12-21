const express = require('express');

const router = express.Router();
const verify = require('../../controllers/auth/verify');
const controller = require('../../controllers/api/me-api-controller');

router.use(verify);

router.get('/checktoken', controller.checkToken);
router.post('/chatToken', controller.chatToken);

module.exports = router;
