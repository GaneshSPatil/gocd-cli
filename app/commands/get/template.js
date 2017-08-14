const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentHelper = require(path.resolve('app/services/argumentHelper.js'));

const templateGetAPI = require(path.resolve('app/api/templates/get.js'));

module.exports = (program) => {
  const nameOption = '-n, --name <template_name>';

  program.
    command('get_template')
    .option(nameOption, 'Name of the template')
    .description('get a template')
    .action((options) => {
      argumentHelper.validateNotNull(options.name, nameOption);
      return templateGetAPI(options.name)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
