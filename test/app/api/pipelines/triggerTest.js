const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire').noCallThru();

const systemProperties = require(path.resolve('app/configs/systemProperties.js'));
const goconfigPath = path.join(systemProperties.GO_CONFIG_FILE_PATH);

const stubbedGoConfig = {
  'GOCD_SERVER_URL': 'http://go_server_url.com/go',
  'GOCD_SERVER_USERNAME': 'username',
  'GOCD_SERVER_PASSWORD': 'password'
};
const stubbedRequest = sinon.stub();

const stubbedRequires = {};

stubbedRequires.request = stubbedRequest;
stubbedRequires[goconfigPath] = stubbedGoConfig;

const pipelinestriggerAPI = proxyquire(path.resolve('app/api/pipelines/trigger.js'), stubbedRequires);

describe('pipelines trigger API', () => {
  const pipelineName = 'up42';

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make pipelines api schedule call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/pipelines/${pipelineName}/schedule`,
      'method': 'POST',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Confirm': 'true'}
    };

    stubbedRequest.yields(null, {});

    return pipelinestriggerAPI(pipelineName).then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should trigger pipeline', () => {
    const triggerResponse = 'Pipeline triggered!';

    stubbedRequest.yields(null, {'body': triggerResponse});
    return pipelinestriggerAPI(pipelineName).then((res) => {
      assert.that(res).is.equalTo(triggerResponse);
    });
  });

  it('should return error occurred while triggering pipeline', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return pipelinestriggerAPI(pipelineName).catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
