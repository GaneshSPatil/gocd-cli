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

const templatesIndexAPI = proxyquire(path.resolve('app/api/templates/index.js'), stubbedRequires);

describe('templates Index API', () => {

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make templates api index call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/admin/templates`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v3+json'}
    };

    stubbedRequest.yields(null, {});

    return templatesIndexAPI().then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch templates', () => {
    const agents = ['template-1', 'template-2'];

    stubbedRequest.yields(null, {'body': agents});
    return templatesIndexAPI().then((res) => {
      assert.that(res).is.equalTo(agents);
    });
  });

  it('should return error occurred while fetching templates', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return templatesIndexAPI().catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
