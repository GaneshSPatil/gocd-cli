const fs = require('fs');
const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));
const systemProperties = require(path.resolve('app/configs/systemProperties.js'));
const goConfigFilePath = systemProperties.GO_CONFIG_FILE_PATH;

module.exports = (program) => {
  const locationOption = '-l, --location <location>';
  const usernameOption = '-u, --username <username>';
  const passwordOption = '-p, --password <password>';

  program
    .command('configure')
    .option(locationOption, 'GoCD server url')
    .option(usernameOption, 'GoCD admin username')
    .option(passwordOption, 'GoCD admin password')
    .description('configure authentication')
    .action((options) => {
      argumentValidator.validateNotNull(options.location, locationOption);
      argumentValidator.validateNotNull(options.username, usernameOption);
      argumentValidator.validateNotNull(options.password, passwordOption);

      const config = {
        'GOCD_SERVER_URL': options.location,
        'GOCD_SERVER_USERNAME': options.username,
        'GOCD_SERVER_PASSWORD': options.password
      };

      fs.writeFileSync(goConfigFilePath, JSON.stringify(config));
      LOGGER.info('\n Successfully configured cli auth!!\n');
    });
};
