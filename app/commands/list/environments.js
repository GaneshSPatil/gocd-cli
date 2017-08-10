const path = require('path');
const environmentsIndexAPI = require(path.resolve('app/api/environments/index.js'));

module.exports = (program) => {
  program
    .command('list_environments')
    .description('lists all the environments')
    .action(function (options) {
      environmentsIndexAPI(options)
        .then(console.log)
        .catch(console.error);
    });
};
