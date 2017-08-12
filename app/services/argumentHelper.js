/* eslint-disable */
const path = require('path');
const LOGGER = require(path.resolve('app/services/logger.js'));

module.exports = {
  'validateNotNull': (arg, option) => {
    if (arg == undefined || typeof arg !== 'string') {
      LOGGER.error(`\n error: option '${option}' argument missing \n`);
      process.exit(1);
    }
  },

  'parse': (args) => {
    if (args[2] === 'list' || args[2] === 'get') {
      const entity = args.splice(3, 1);

      args[2] = `${args[2]}_${entity}`;
    }

    return args;
  },

  'validateNotEmpty': (args) => {
    if (args.length == 2) {
      LOGGER.error(`\n error: command not found!! \n`);
      process.exit(1);
    }
  }
};