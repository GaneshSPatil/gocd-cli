const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelineTriggerAPIPath = path.resolve('app/api/pipelines/trigger.js');
const loggerPath = path.resolve('app/services/logger.js');
const argumentValidatorPath = path.resolve('app/services/argumentHelper.js');

const stubbedPipelinesTriggerAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const stubbedArgumentValidator = {'validateNotNull': sinon.stub()};

const stubbedRequires = {};

stubbedRequires[pipelineTriggerAPIPath] = stubbedPipelinesTriggerAPI;
stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[argumentValidatorPath] = stubbedArgumentValidator;

const triggerCommand = proxyquire(path.resolve('app/commands/trigger/pipeline.js'), stubbedRequires);

describe('Pipelines Trigger Command', () => {
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
  });

  it('should set the command on the program', () => {
    triggerCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('trigger_pipeline');
  });

  it('should set the description on the program', () => {
    triggerCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('trigger a pipeline');
  });

  it('should make api call to pipeline trigger on action', () => {
    const options = {'name': 'up42'};

    stubbedPipelinesTriggerAPI.resolves({});
    triggerCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedPipelinesTriggerAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const pipeline = {};
    const options = {'name': 'up42'};

    stubbedPipelinesTriggerAPI.resolves(pipeline);
    triggerCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');
    const options = {'name': 'up42'};

    stubbedPipelinesTriggerAPI.rejects(error);
    triggerCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should validate name argument option', () => {
    const pipeline = {};
    const options = {'name': 'up42'};

    stubbedPipelinesTriggerAPI.resolves(pipeline);
    triggerCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[0]).is.equalTo('up42');
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[1]).is.equalTo('-n, --name <pipeline_name>');
    });
  });

  it('should reject when name argument validation fails', () => {
    stubbedArgumentValidator.validateNotNull.throws(new Error('Boom!!'));
    triggerCommand(program);
    assert.that(() => {
      action.getCall(0).args[0]({});
    }).is.throwing('Boom!!');
  });

});
