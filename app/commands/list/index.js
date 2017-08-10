const path = require('path');

const listCommands = [
  require(path.resolve('app/commands/list/environments.js')),
  require(path.resolve('app/commands/list/agents.js'))
];

module.exports = (program) => {
  listCommands.forEach((command) => {
    command(program);
  });
};
