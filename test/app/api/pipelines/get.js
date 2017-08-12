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

const pipelinesGetAPI = proxyquire(path.resolve('app/api/pipelines/get.js'), stubbedRequires);

describe('pipelines Get API', () => {
  const pipelineName = 'up42';

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make pipelines api index call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/admin/pipelines/${pipelineName}`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v4+json'}
    };

    stubbedRequest.yields(null, {});

    return pipelinesGetAPI(pipelineName).then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch pipeline', () => {
    const pipeline = 'up42';

    stubbedRequest.yields(null, {'body': pipeline});
    return pipelinesGetAPI(pipelineName).then((res) => {
      assert.that(res).is.equalTo(pipeline);
    });
  });

  it('should return error occurred while fetching pipeline', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return pipelinesGetAPI(pipelineName).catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
