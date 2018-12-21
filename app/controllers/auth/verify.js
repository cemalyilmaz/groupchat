const jwt = require('jsonwebtoken');
var config = require('./jwt-config');

const {sendError} = require('../api-response');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.body.token || req.query.token;

    if (!token) {
        return sendError(req, res, next, {
            code: 403, message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return sendError(req, res, next, {
                code: 403, message: 'Failed to authenticate the token.'
            });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;