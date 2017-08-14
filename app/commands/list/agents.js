const path = require('path');
const LOGGER = require(path.resolve('app/services/logger.js'));
const agentsIndexAPI = require(path.resolve('app/api/agents/index.js'));
const argumentHelper = require(path.resolve('app/services/argumentHelper.js'));

module.exports = (program) => {
  const stateOption = '-s, --state <agent_state>';
  const allValidOptions = ['Idle', 'Building', 'LostContact', 'Missing', 'Cancelled', 'Unknown'];

  program
    .command('list_agents')
    .description('lists all the agents')
    .option(stateOption, 'state of the agent')
    .action((options) => {
      argumentHelper.validateAnyOf(options.state, allValidOptions, stateOption);
      return agentsIndexAPI(options)
        .then((res) => {
          let agents;

          if (options.state) {
            agents = JSON.parse(res);
            agents._embedded.agents = JSON.parse(res)._embedded.agents.filter((agent) => agent.agent_state === options.state);
          } else {
            agents = JSON.parse(res);
          }

          LOGGER.info(JSON.stringify(agents, null, 2));
        })
        .catch(LOGGER.error);
    });
};
