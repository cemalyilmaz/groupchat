const environment = process.env.NODE_ENV || 'development';
const config = require('./app-config')(environment);

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(config.databaseUri, {useNewUrlParser: true});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const {sendError} = require('./controllers/api-response');

let admin = require('firebase-admin');

let serviceAccount = require("../cert/development-firebase_admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://groupchat-8e248.firebaseio.com/"
});

const apiRouter = require('./routes/api');
app.use('/api/v1/', apiRouter);

app.use(function (err, req, res, next) {
    let contentType = req.get('Content-Type');
    if (contentType === 'application/json') {
        sendError(req, res, next, {
            message: err.message, code: err.code
        });
    } else {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    }
});

const groupchat = require('groupchat')({
    dbName: "chat",
    systemUser: "theBoss"
});

const {Subject, User} = require('models');
let u = new User();

let subject = new Subject({
    owner: u.id,
    name: "Name of the subject"
});

groupchat.createEventThread({
    subject,
    name: "param name",
    initialMessage: 'Hello world'
})
    .then(() => {
        console.log('done!!!');
    });

module.exports = app;
