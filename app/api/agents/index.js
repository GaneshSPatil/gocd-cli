const path = require('path');
const url = require('url');
const request = require('request');
const config = require(path.resolve('.goconfig.json'));

module.exports = () => {
  const requestConfig = {
    'url':     url.resolve(config.GOCD_SERVER_URL, 'go/api/agents'),
    'method':  'GET',
    'auth':    {
      'username': config.GOCD_SERVER_USERNAME,
      'password': config.GOCD_SERVER_PASSWORD
    },
    'headers': {
      'Accept': 'application/vnd.go.cd.v4+json'
    }
  };

  return new Promise((fulfil, reject) => {
    return request(requestConfig, (err, res) => {
      err ? reject(err) : fulfil(res.body);
    });
  });
};
