/* eslint-disable */
const fs = require('fs');
const path = require('path');
const systemProperties = require(path.resolve('app/configs/systemProperties.js'));
const goConfigFilePath = systemProperties.GO_CONFIG_FILE_PATH;
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
  },

  'validateAuthSpecified': (args) => {
    if( args.includes('configure')) return;
    if(!fs.existsSync(goConfigFilePath)) {
      const errorMessage = [
        '',
        ' error: cli auth not configured!!',
        ''
      ].join('\n');
      LOGGER.error(errorMessage);
      process.exit(1);
    }
  }
};