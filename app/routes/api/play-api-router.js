const express = require('express');
const router = express.Router();

const verify = require('../../controllers/auth/verify');
const controller = require('../../controllers/api/subject-api-controller');

router.use(verify);
router.param('subjectId', controller.idParam());

router.get('/', controller.list);
router.post('/', controller.create);
router.post('/:subjectId/join', controller.join);
router.post('/:subjectId/leave', controller.leave);
router.post('/:subjectId/remove', controller.remove);
router.get('/:subjectId', controller.detail);

module.exports = router;