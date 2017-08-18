const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const cctrayAPIPath = path.resolve('app/api/cctray/index.js');
const loggerPath = path.resolve('app/services/logger.js');
const argumentValidatorPath = path.resolve('app/services/argumentHelper.js');

const stubbedCctrayIndexAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const stubbedArgumentValidator = {'validateNotNull': sinon.stub()};

const stubbedRequires = {};

stubbedRequires[cctrayAPIPath] = stubbedCctrayIndexAPI;
stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[argumentValidatorPath] = stubbedArgumentValidator;

const statusCommand = proxyquire(path.resolve('app/commands/status/pipeline.js'), stubbedRequires);

describe('Pipelines Status Command', () => {
  const command = sinon.stub();
  const description = sinon.stub();
  const action = sinon.stub();
  const option = sinon.stub();

  const program = {
    command,
    description,
    action,
    option
  };

  beforeEach(() => {
    command.returns(program);
    description.returns(program);
    action.returns(program);
    option.returns(program);
  });

  afterEach(() => {
    command.reset();
    description.reset();
    action.reset();
    option.reset();
    stubbedLogger.info.reset();
    stubbedLogger.error.reset();
    stubbedCctrayIndexAPI.reset();
  });

  it('should set the command on the program', () => {
    statusCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('status_pipeline');
  });

  it('should set the description on the program', () => {
    statusCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('status of a pipeline');
  });

  it('should make api call to cctray index on action', () => {
    const options = {'name': 'up42'};

    stubbedCctrayIndexAPI.resolves([]);
    statusCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedCctrayIndexAPI.callCount).is.equalTo(1);
    });
  });

  it('should return the status of the specified pipeline', () => {
    const cctrayResponse = [
      {
        'name': 'up42 :: up42_stage',
        'activity': 'Sleeping',
        'lastBuildStatus': 'Failure',
        'lastBuildLabel': '1',
        'lastBuildTime': '2017-08-18T16:38:32',
        'webUrl': 'http://127.0.0.1:8153/go/pipelines/up42/1/up42_stage/1',
        'pipelineName': 'up42',
        'stageName': 'up42_stage',
        'jobName': null,
        'status': 'Failure'
      }
    ];
    const options = {'name': 'up42'};

    const expectedStatus = {
      'pipelineName': 'up42',
      'stageName': 'up42_stage',
      'status': 'Failure',
      'webUrl': 'http://127.0.0.1:8153/go/pipelines/up42/1/up42_stage/1'
    };

    stubbedCctrayIndexAPI.resolves(cctrayResponse);
    statusCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo(JSON.stringify(expectedStatus, null, 2));
    });
  });

  it('should throw error when status for the specified pipeline could not be found', () => {
    const cctrayResponse = [];
    const options = {'name': 'up42'};

    stubbedCctrayIndexAPI.resolves(cctrayResponse);
    statusCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo('\n error: Pipeline \'up42\' not found\n');
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');
    const options = {'name': 'up42'};

    stubbedCctrayIndexAPI.rejects(error);
    statusCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should validate name argument option', () => {
    const pipeline = {};
    const options = {'name': 'up42'};

    stubbedCctrayIndexAPI.resolves(pipeline);
    statusCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[0]).is.equalTo('up42');
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[1]).is.equalTo('-n, --name <pipeline_name>');
    });
  });

  it('should reject when name argument validation fails', () => {
    stubbedArgumentValidator.validateNotNull.throws(new Error('Boom!!'));
    statusCommand(program);
    assert.that(() => {
      action.getCall(0).args[0]({});
    }).is.throwing('Boom!!');
  });

});
