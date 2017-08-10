const path = require('path');
const program = require('commander');

const list = require(path.resolve('app/commands/list/index.js'));

const commands = [
  list
];

commands.forEach((command) => {
  command(program);
});

const args = process.argv;

// stupid hack due to commander's space separation under commands
if (args[2] === 'list') {
  const entity = args.splice(3, 1);

  args[2] = `${args[2]}_${entity}`;
}

program.parse(args);
