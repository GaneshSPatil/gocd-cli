const path = require('path');

module.exports = {
  'DATA_FOLDER_PATH': path.join(process.env.HOME + '/.gocd_cli'), //eslint-disable-line
  'GO_CONFIG_FILE_PATH': path.join(process.env.HOME + '/.gocd_cli', '/goconfig.json') //eslint-disable-line
};
