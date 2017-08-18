const path = require('path');

const statusCommands = [
  require(path.resolve('app/commands/status/stage.js')),
  require(path.resolve('app/commands/status/pipeline.js'))
];

module.exports = (program) => {
  statusCommands.forEach((command) => {
    command(program);
  });
};
