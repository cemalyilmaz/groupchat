const {User} = Models = require('models');
const {sendSuccess, sendError} = require('../api-response');

function createUser(req, res, next) {
    let email = req.query.email || req.body.email;
    let password = req.query.password || req.body.password;
    let name = req.query.name || req.body.name || '';
    let surname = req.query.surname || req.body.surname || '';

    if (email === undefined || password === undefined) {
        sendError(req, res, next, {code: 422, message: 'parameter error.'});
        return;
    }

    var newUser = User({
        name: name,
        surname: surname,
        login: {
            local: {
                email: email,
            }
        },
    });

    newUser.login.local.password = newUser.generateHash(password);

    newUser.save()
        .then((object, err) => {
            if (err) {
                sendError(req, res, next, err);
            }
            else {
                sendSuccess(req, res, next, object);
            }
        })
        .catch((exception) => {
            sendError(req, res, next, exception);
        });
}

function updateUser(req, res, next) {
    let userId = req.userId;

    let update = {};

    if (req.body.name || req.query.name !== undefined) {
        update['name'] = req.body.name || req.query.name;
    }

    if (req.body.surname || req.query.surname !== undefined) {
        update['surname'] = req.body.surname || req.query.surname;
    }

    User.findById(userId).then(user => {
        user.set(update);
        user.save().then((updated) => {
            sendSuccess(req, res, next, updated);
        })
    }).catch(exception => {
        sendError(req, res, next, exception);
    });
}

module.exports.create = createUser;
module.exports.update = updateUser;