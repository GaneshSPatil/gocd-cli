const path = require('path');
const program = require('commander');
const argumentHeler = require(path.resolve('app/services/argumentHelper.js'));
const args = argumentHeler.parse(process.argv);

argumentHeler.validateNotEmpty(args);
argumentHeler.validateAuthSpecified(args);

require(path.resolve('app/services/setup.js'))(program);

program.parse(args);
