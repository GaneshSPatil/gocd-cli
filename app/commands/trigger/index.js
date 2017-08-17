const path = require('path');

const getCommands = [
  require(path.resolve('app/commands/trigger/pipeline.js'))
];

module.exports = (program) => {
  getCommands.forEach((command) => {
    command(program);
  });
};
