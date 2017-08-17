const path = require('path');
const request = require('request');
const systemProperties = require(path.resolve('app/configs/systemProperties.js'));

module.exports = (pipelineName) => {
  const config = require(systemProperties.GO_CONFIG_FILE_PATH);
  const requestConfig = {
    'url': `${config.GOCD_SERVER_URL}/api/pipelines/${pipelineName}/schedule`,
    'method': 'POST',
    'auth': {
      'username': config.GOCD_SERVER_USERNAME,
      'password': config.GOCD_SERVER_PASSWORD
    },
    'headers': {'Confirm': 'true'}
  };

  return new Promise((fulfil, reject) => request(requestConfig, (err, res) => {
    err ? reject(err) : fulfil(res.body);
  }));
};
