const path       = require('path');
const sinon      = require('sinon');
const assert     = require('assertthat');
const proxyquire = require('proxyquire');

const goconfigPath = path.resolve('.goconfig.json');

const stubbedGoConfig = {
  "GOCD_SERVER_URL":      "http://go_server_url.com/go",
  "GOCD_SERVER_USERNAME": "username",
  "GOCD_SERVER_PASSWORD": "password"
};
const stubbedRequest  = sinon.stub();

const stubbedRequires         = {};
stubbedRequires['request']    = stubbedRequest;
stubbedRequires[goconfigPath] = stubbedGoConfig;

const agentsIndexAPI = proxyquire(path.resolve('app/api/agents/index.js'), stubbedRequires);

describe('Agents Index API', () => {

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make agents api index call with appropriate options', () => {
    const expectedOptions = {
      url:     `${stubbedGoConfig.GOCD_SERVER_URL}/api/agents`,
      method:  'GET',
      auth:    {
        username: stubbedGoConfig.GOCD_SERVER_USERNAME,
        password: stubbedGoConfig.GOCD_SERVER_PASSWORD
      },
      headers: {
        Accept: 'application/vnd.go.cd.v4+json'
      }
    };

    stubbedRequest.yields(null, {});

    return agentsIndexAPI().then(() => {
      let actualOptions = stubbedRequest.getCall(0).args[0];
      assert.that(actualOptions).is.equalTo(expectedOptions);
    })
  });


  it('should fetch agents', () => {
    const agents = ['agent-1', 'agent-2'];
    stubbedRequest.yields(null, {body: agents});
    return agentsIndexAPI().then((res) => {
      assert.that(res).is.equalTo(agents);
    })
  });

  it('should return error occurred while fetching agents', () => {
    let error = new Error('Boom!');
    stubbedRequest.yields(error, null);
    return agentsIndexAPI().catch((err) => {
      assert.that(err).is.equalTo(error);
    })
  });
});
