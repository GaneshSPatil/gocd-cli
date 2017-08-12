const path = require('path');
const assert = require('assertthat');

const systemProperties = require(path.resolve('app/configs/systemProperties'));

describe('System Properties', () => {
  it('should specify system properties', () => {
    const expectedDataFolderPath = path.join(process.env.HOME + '/.gocd_cli'); //eslint-disable-line
    const expectedGoConfigFilePath = path.join(process.env.HOME + '/.gocd_cli', '/goconfig.json'); //eslint-disable-line

    assert.that(systemProperties.DATA_FOLDER_PATH).is.equalTo(expectedDataFolderPath);
    assert.that(systemProperties.GO_CONFIG_FILE_PATH).is.equalTo(expectedGoConfigFilePath);
  });

});
