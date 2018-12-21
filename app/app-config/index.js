const _ = require('lodash');

const config = require('./config.json');
const defaultConfig = config.development;

module.exports = (environment) => {
    return _.merge(defaultConfig, config[environment]);
};
