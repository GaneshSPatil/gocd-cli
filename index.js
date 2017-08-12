const path = require('path');
const program = require('commander');
const argumentHeler = require(path.resolve('app/services/argumentHelper.js'));

require(path.resolve('app/services/setup.js'))(program);

const args = argumentHeler.parse(process.argv);

argumentHeler.validateNotEmpty(args);

program.parse(args);
