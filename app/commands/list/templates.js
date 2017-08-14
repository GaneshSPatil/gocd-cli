const path = require('path');
const LOGGER = require(path.resolve('app/services/logger.js'));
const templatesIndexAPI = require(path.resolve('app/api/templates/index.js'));

module.exports = (program) => {
  program.
    command('list_templates').
    description('lists all the templates').
    action((options) => templatesIndexAPI(options).
      then(LOGGER.info).
      catch(LOGGER.error));
};
