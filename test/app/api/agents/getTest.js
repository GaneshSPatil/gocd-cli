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

const agentsGetAPI = proxyquire(path.resolve('app/api/agents/get.js'), stubbedRequires);

describe('agents Get API', () => {
  const agentUUID = 'agent-1';

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make agents api get call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/agents/${agentUUID}`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v4+json'}
    };

    stubbedRequest.yields(null, {});

    return agentsGetAPI(agentUUID).then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch agent', () => {
    const agent = 'agent-1';

    stubbedRequest.yields(null, {'body': agent});
    return agentsGetAPI(agent).then((res) => {
      assert.that(res).is.equalTo(agent);
    });
  });

  it('should return error occurred while fetching agent', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return agentsGetAPI(agentUUID).catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
