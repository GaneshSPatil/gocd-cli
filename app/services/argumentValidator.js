/* eslint-disable */
const path = require('path');
const LOGGER = require(path.resolve('app/services/logger.js'));

module.exports = {
  'validateNotNull': (arg, option) => {
    if (arg == undefined || typeof arg !== 'string') {
      LOGGER.error(`\n error: option '${option}' argument missing \n`);
      process.exit(1);
    }
  }
};