const Models = require('rt-models');
const Subject = Models.Subject;

const {sendSuccess, sendError} = require('../api-response');

function list(req, res, next) {
    return Subject
        .find({})
        .then((subjects, err) => {
            sendSuccess(req, res, next, subjects);
        })
        .catch(exception => {
            sendError(req, res, next, exception);
        });
}

function idParam(req, res, next) {
    let subjectId = req.param('subjectId');

    Subject.findById(subjectId)
        .then(subject => {
            if (subject) {
                req.subject = subject;
                next();
            }
            else {
                next(new Error('Subject not found'));
            }
        })
        .catch(exception => {
            next(exception);
        });
}

module.exports.list = list;
module.exports.idParam = idParam;
