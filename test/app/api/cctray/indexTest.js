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

const cctrayIndexAPI = proxyquire(path.resolve('app/api/cctray/index.js'), stubbedRequires);

describe('Cctray Index API', () => {

  afterEach(() => {
    stubbedRequest.reset();
  });

  it('should make cctray index api call with appropriate options', () => {
    /*eslint-disable */
    const cctrayResponse = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<Projects>',
      '<Project name="up42 :: up42_stage" \ activity="Sleeping" lastBuildStatus="Failure" lastBuildLabel="1" lastBuildTime="2017-08-18T16:38:32" webUrl="http://127.0.0.1:8153/go/pipelines/up42/1/up42_stage/1" />',
      '</Projects>'
    ].join('');
    /*eslint-enable */

    const expectedOptions = {
      'url': `${stubbedGoConfig.GOCD_SERVER_URL}/cctray.xml`,
      'method': 'GET',
      'auth': {
        'username': stubbedGoConfig.GOCD_SERVER_USERNAME,
        'password': stubbedGoConfig.GOCD_SERVER_PASSWORD
      }
    };

    stubbedRequest.yields(null, {'body': cctrayResponse});

    return cctrayIndexAPI().then(() => {
      const actualOptions = stubbedRequest.getCall(0).args[0];

      assert.that(actualOptions).is.equalTo(expectedOptions);
    });
  });

  it('should fetch cctray response', () => {
    /*eslint-disable */
    const cctrayResponse = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<Projects>',
      '<Project name="up42 :: up42_stage" \ activity="Building" lastBuildStatus="Failure" lastBuildLabel="1" lastBuildTime="2017-08-18T16:38:32" webUrl="http://127.0.0.1:8153/go/pipelines/up42/1/up42_stage/1" />',
      '<Project name="up42 :: up42_stage :: up42_job" activity="Sleeping" lastBuildStatus="Failure" lastBuildLabel="1" lastBuildTime="2017-08-18T16:38:32" webUrl="http://127.0.0.1:8153/go/tab/build/detail/up42/1/up42_stage/1/up42_job" />',
      '</Projects>'
    ].join('');
    /*eslint-enable */

    const expectedStageProject = {
      'name': 'up42 :: up42_stage',
      'activity': 'Building',
      'lastBuildStatus': 'Failure',
      'lastBuildLabel': '1',
      'lastBuildTime': '2017-08-18T16:38:32',
      'webUrl': 'http://127.0.0.1:8153/go/pipelines/up42/1/up42_stage/1',
      'pipelineName': 'up42',
      'stageName': 'up42_stage',
      'jobName': null,
      'status': 'Building'
    };

    const expectedJobProject = {
      'name': 'up42 :: up42_stage :: up42_job',
      'activity': 'Sleeping',
      'lastBuildStatus': 'Failure',
      'lastBuildLabel': '1',
      'lastBuildTime': '2017-08-18T16:38:32',
      'webUrl': 'http://127.0.0.1:8153/go/tab/build/detail/up42/1/up42_stage/1/up42_job',
      'pipelineName': 'up42',
      'stageName': 'up42_stage',
      'jobName': 'up42_job',
      'status': 'Failure'
    };

    stubbedRequest.yields(null, {'body': cctrayResponse});

    return cctrayIndexAPI().then((res) => {
      assert.that(res).is.equalTo([expectedStageProject, expectedJobProject]);
    });
  });

  it('should return error occurred while parsing cctray output', () => {
    const invalidXml = 'this is not xml!!';

    stubbedRequest.yields(null, {'body': invalidXml});

    return cctrayIndexAPI().catch((err) => {
      assert.that(err.toString()).is.containing('Error: Non-whitespace before first tag.');
    });
  });

  it('should return error occurred while fetching cctray output', () => {
    const error = new Error('Boom!');

    stubbedRequest.yields(error, null);
    return cctrayIndexAPI().catch((err) => {
      assert.that(err).is.equalTo(error);
    });
  });
});
