const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentHelper = require(path.resolve('app/services/argumentHelper.js'));

const environmentGetAPI = require(path.resolve('app/api/environments/get.js'));

module.exports = (program) => {
  const nameOption = '-n, --name <environment_name>';

  program.
    command('get_environment')
    .option(nameOption, 'Name of the environment')
    .description('get an environment')
    .action((options) => {
      argumentHelper.validateNotNull(options.name, nameOption);
      return environmentGetAPI(options.name)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
