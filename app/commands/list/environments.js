const path                 = require('path');
const LOGGER               = require(path.resolve('app/services/logger.js'));
const environmentsIndexAPI = require(path.resolve('app/api/environments/index.js'));

module.exports = (program) => {
  program
    .command('list_environments')
    .description('lists all the environments')
    .action(function (options) {
      return environmentsIndexAPI(options)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};