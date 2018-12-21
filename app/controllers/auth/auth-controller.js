const {sendSuccess, sendError} = require('../api-response');

const {User} = require('models');

const jwt = require('jsonwebtoken');
const config = require('./jwt-config');

function signup(req, res, next) {
    var newUser = new User();
    newUser.name = req.body.name || '';
    newUser.surname = req.body.surname || '';
    newUser.login.local.email = req.body.email;
    newUser.login.local.password = newUser.generateHash(req.body.password);

    newUser.save()
        .then((user, err) => {
            if (err) {
                return sendError(req, res, next, {
                    code: 500, message: 'There was an error.'
                })
            }

            let token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: config.expires
            });

            sendSuccess(req, res, next, {
                success: true, token: token
            });
        })
        .catch(exception => {
            next(exception);
        });
}

function login(req, res, next) {
    User.findOne({'login.local.email': req.body.email}, function (err, user) {
        if (err) {
            return sendError(req, res, next, {
                code: 500, message: 'Server error'
            });
        }
        if (!user) {
            return sendError(req, res, next, {
                code: 404, message: 'No user found'
            });
        }

        var passwordIsValid = user.validPassword(req.body.password);
        if (!passwordIsValid) {
            return sendError(req, res, next, {
                code: 401, message: 'User/Password do not match.'
            });
        }

        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: config.expires
        });

        sendSuccess(req, res, next, {
            success: true, token: token
        });
    });
}

const passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

function logout(req, res, next) {
    sendSuccess(req, res, next, {
        success: true, token: null
    })
}

function me(req, res, next) {
    User.findById(req.userId)
        .then((user, err) => {
            if (err) {
                return sendError(req, res, next, {
                    code: 500, message: 'Server error.'
                });
            }

            if (!user) {
                return sendError(req, res, next, {
                    code: 404, message: 'No user found'
                });
            }
            return user;
        })
        .then((user) => {
            let response = {};
            response.user = user.toObject();
            return sendSuccess(req, res, next, response);
        })
        .catch(exception => {
            console.log(exception);
            return sendError(req, res, next, exception);
        });
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.logout = logout;
module.exports.me = me;