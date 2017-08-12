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

const environmentsIndexAPI = proxyquire(path.resolve('app/api/environments/index.js'), stubbedRequires);

describe('Environments Index API', () => {

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make environments api index call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/admin/environments`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v2+json'}
    };

    stubbedRequest.yields(null, {});

    return environmentsIndexAPI().then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch environments', () => {
    const agents = ['environment-1', 'environment-2'];

    stubbedRequest.yields(null, {'body': agents});
    return environmentsIndexAPI().then((res) => {
      assert.that(res).is.equalTo(agents);
    });
  });

  it('should return error occurred while fetching environments', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return environmentsIndexAPI().catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
