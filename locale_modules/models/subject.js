const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true, indexed: true},
    threadId: {type: String},
});

schema.options.toObject = {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

schema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

let Subject = mongoose.model('Subject', schema);
module.exports = Subject;