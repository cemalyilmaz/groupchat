const admin = require("firebase-admin");
const {sendSuccess, sendError} = require('../api-response');

function checkToken(req, res, next) {
    sendSuccess(req, res, next, {success: true});
}

function chatToken(req, res, next) {
    let userId = req.userId;
    admin.auth().createCustomToken(userId)
        .then(function (customToken) {
            let result = {token: customToken};
            console.log(result);
            sendSuccess(req, res, next, result);
        })
        .catch(function (exception) {
            sendError(req, res, next, exception);
        });
}

module.exports.checkToken = checkToken;
module.exports.chatToken = chatToken;