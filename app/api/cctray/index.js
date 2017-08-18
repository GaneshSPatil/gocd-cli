const path = require('path');
const request = require('request');
const parseString = require('xml2js').parseString;
const systemProperties = require(path.resolve('app/configs/systemProperties.js'));

const parseCctrayOutput = (res) => {
  const allEvents = res.Projects.Project.map((f) => {
    const feed = f.$;
    const nameFor = feed.name.split(' :: ');

    feed.pipelineName = nameFor[0];
    feed.stageName = nameFor[1];

    feed.pipelineName = nameFor[0];
    feed.stageName = nameFor[1];

    if (nameFor.length === 2) {
      feed.jobName = null;
    }

    if (nameFor.length === 3) {
      feed.jobName = nameFor[2];
    }

    if (feed.activity === 'Sleeping') {
      feed.status = feed.lastBuildStatus;
    } else {
      feed.status = feed.activity;
    }

    return feed;
  });

  return allEvents;
};

module.exports = () => {
  const config = require(systemProperties.GO_CONFIG_FILE_PATH);

  const requestConfig = {
    'url': `${config.GOCD_SERVER_URL}/cctray.xml`,
    'method': 'GET',
    'auth': {
      'username': config.GOCD_SERVER_USERNAME,
      'password': config.GOCD_SERVER_PASSWORD
    }
  };

  return new Promise((fulfil, reject) => request(requestConfig, (err, res) => {
    if (err) {
      reject(err);
    } else {
      parseString(res.body, (error, result) => {
        error ? reject(error) : fulfil(parseCctrayOutput(result));
      });
    }
  }));
};
