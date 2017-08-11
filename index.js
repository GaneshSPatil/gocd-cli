const path = require('path');
const fs = require('fs');
const program = require('commander');
const customHelpText = fs.readFileSync(path.resolve('app/bin/help.txt'), 'utf8');

program.helpInformation = () => customHelpText;

const list = require(path.resolve('app/commands/list/index.js'));
const get = require(path.resolve('app/commands/get/index.js'));

const commands = [
  list,
  get
];

commands.forEach((command) => {
  command(program);
});

const args = process.argv;

// stupid hack due to commander's space separation under commands
if (args[2] === 'list' || args[2] === 'get') {
  const entity = args.splice(3, 1);

  args[2] = `${args[2]}_${entity}`;
}

program.parse(args);
