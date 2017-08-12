const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const agentGetAPI = require(path.resolve('app/api/agents/get.js'));

module.exports = (program) => {
  const uuidOption = '-u, --uuid <agent_uuid>';

  program.
    command('get_agent')
    .option(uuidOption, 'UUID of agent')
    .description('get an agent')
    .action((options) => {
      argumentValidator.validateNotNull(options.uuid, uuidOption);
      return agentGetAPI(options.uuid)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
