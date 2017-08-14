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

const templatesGetAPI = proxyquire(path.resolve('app/api/templates/get.js'), stubbedRequires);

describe('templates Get API', () => {
  const templateName = 'dev';

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make templates api index call with appropriate options', () => {
    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/api/admin/templates/${templateName}`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      'headers': {'Accept': 'application/vnd.go.cd.v3+json'}
    };

    stubbedRequest.yields(null, {});

    return templatesGetAPI(templateName).then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });


  it('should fetch template', () => {
    const template = 'dev';

    stubbedRequest.yields(null, {'body': template});
    return templatesGetAPI(templateName).then((res) => {
      assert.that(res).is.equalTo(template);
    });
  });

  it('should return error occurred while fetching template', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return templatesGetAPI(templateName).catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
