const path = require('path');

const getCommands = [
  require(path.resolve('app/commands/get/pipeline.js')),
  require(path.resolve('app/commands/get/agent.js'))
];

module.exports = (program) => {
  getCommands.forEach((command) => {
    command(program);
  });
};
