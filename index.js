const path = require('path');
const program = require('commander');
const argumentHeler = require(path.resolve('app/services/argumentHelper.js'));

require(path.resolve('app/services/setup.js'))(program);
program.parse(argumentHeler.parse(process.argv));
