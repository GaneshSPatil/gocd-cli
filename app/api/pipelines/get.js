const path = require('path');
const request = require('request');
const systemProperties = require(path.resolve('app/configs/systemProperties.js'));
const config = require(systemProperties.GO_CONFIG_FILE_PATH);

module.exports = (pipelineName) => {
  const requestConfig = {
    'url': `${config.GOCD_SERVER_URL}/api/admin/pipelines/${pipelineName}`,
    'method': 'GET',
    'auth': {
      'username': config.GOCD_SERVER_USERNAME,
      'password': config.GOCD_SERVER_PASSWORD
    },
    'headers': {'Accept': 'application/vnd.go.cd.v4+json'}
  };

  return new Promise((fulfil, reject) => request(requestConfig, (err, res) => {
    err ? reject(err) : fulfil(res.body);
  }));
};
