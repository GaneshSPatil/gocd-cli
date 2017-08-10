const path           = require('path');
const LOGGER         = require(path.resolve('app/services/logger.js'));
const agentsIndexAPI = require(path.resolve('app/api/agents/index.js'));

module.exports = (program) => {
  program
    .command('list_agents')
    .description('lists all the agents')
    .action(function (options) {
      return agentsIndexAPI(options)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
