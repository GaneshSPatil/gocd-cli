const path = require('path');
const agentsIndexAPI = require(path.resolve('app/api/agents/index.js'));

module.exports = (program) => {
  program
    .command('list_agents')
    .description('lists all the agents')
    .action(function (options) {
      agentsIndexAPI(options)
        .then(console.log)
        .catch(console.error);
    });
};
