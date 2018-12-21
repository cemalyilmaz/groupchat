const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const schema = new Schema({
    name: String,
    surname: String,

    login: {
        local: {
            email: {
                type: String,
                required: [true, 'Email cannot be blank.'],
                trim: true,
                unique: true, // email must be unique
                dropDups: true
            },
            password: {
                type: String,
                required: [true, 'Your password cannot be blank.']
            },
        }
    },
});


schema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.login.local.password);
};

schema.options.toObject = {
    transform: function (doc, ret) {
        ret.id = ret._id;
        if (ret.login) {
            ret.email = (ret.login.local || {}).email;
        }
        delete ret.login;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        if (ret.login) {
            ret.email = (ret.login.local || {}).email;
        }
        delete ret.login;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

let User = mongoose.model('User', schema);
module.exports = User;