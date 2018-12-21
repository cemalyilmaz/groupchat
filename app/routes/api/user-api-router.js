const express = require('express');

const router = express.Router();
const verify = require('../../controllers/auth/verify');
const controller = require('../../controllers/api/user-api-controller');

router.use(verify);

router.post('/', controller.create);
router.put('/', controller.update);

module.exports = router;
