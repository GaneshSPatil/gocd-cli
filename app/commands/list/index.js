const path = require('path');

const listCommands = [
  require(path.resolve('app/commands/list/agents.js')),
  require(path.resolve('app/commands/list/templates.js')),
  require(path.resolve('app/commands/list/environments.js'))
];

module.exports = (program) => {
  listCommands.forEach((command) => {
    command(program);
  });
};
