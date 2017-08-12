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

const environmentsGetAPI = proxyquire(path.resolve('app/api/environments/get.js'), stubbedRequires);

describe('environments Get API', () => {
  const environmentName = 'dev';

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make environments api index call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/admin/environments/${environmentName}`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v2+json'}
    };

    stubbedRequest.yields(null, {});

    return environmentsGetAPI(environmentName).then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch environment', () => {
    const environment = 'dev';

    stubbedRequest.yields(null, {'body': environment});
    return environmentsGetAPI(environmentName).then((res) => {
      assert.that(res).is.equalTo(environment);
    });
  });

  it('should return error occurred while fetching environment', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return environmentsGetAPI(environmentName).catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
