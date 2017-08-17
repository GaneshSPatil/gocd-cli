const fs = require('fs');
const path = require('path');

const systemProperties = require(path.resolve('app/configs/systemProperties.js'));
const dataFolderPath = systemProperties.DATA_FOLDER_PATH;

const commands = [
  require(path.resolve('app/commands/get/index.js')),
  require(path.resolve('app/commands/list/index.js')),
  require(path.resolve('app/commands/trigger/index.js')),
  require(path.resolve('app/commands/configure/index.js'))
];

const initializeCommands = (program) => {
  commands.forEach((command) => {
    command(program);
  });
};

const modifyHelpText = (program) => {
  program.helpInformation = () => fs.readFileSync(path.resolve('app/bin/help.txt'), 'utf8');
};

const createDataStorageFolderIfDoesntExists = () => {
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdir(dataFolderPath, () => {}); //eslint-disable-line
  }
};

module.exports = (program) => {
  initializeCommands(program);
  modifyHelpText(program);
  createDataStorageFolderIfDoesntExists();
};
