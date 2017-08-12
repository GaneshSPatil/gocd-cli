const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelineGetAPIPath = path.resolve('app/api/pipelines/get.js');
const loggerPath = path.resolve('app/services/logger.js');
const argumentValidatorPath = path.resolve('app/services/argumentHelper.js');

const stubbedPipelinesGetAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const stubbedArgumentValidator = {'validateNotNull': sinon.stub()};

const stubbedRequires = {};

stubbedRequires[pipelineGetAPIPath] = stubbedPipelinesGetAPI;
stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[argumentValidatorPath] = stubbedArgumentValidator;

const getCommand = proxyquire(path.resolve('app/commands/get/pipeline.js'), stubbedRequires);

/* eslint no-trailing-spaces:0*/
describe('Pipelines Get Command', () => {
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
    getCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('get_pipeline');
  });

  it('should set the description on the program', () => {
    getCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('get a pipeline');
  });

  it('should make api call to pipeline get on action', () => {
    const options = {'name': 'up42'};

    stubbedPipelinesGetAPI.resolves({});
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedPipelinesGetAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const pipeline = {};
    const options = {'name': 'up42'};

    stubbedPipelinesGetAPI.resolves(pipeline);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');
    const options = {'name': 'up42'};

    stubbedPipelinesGetAPI.rejects(error);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should validate name argument option', () => {
    const pipeline = {};
    const options = {'name': 'up42'};

    stubbedPipelinesGetAPI.resolves(pipeline);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[0]).is.equalTo('up42');
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[1]).is.equalTo('-n, --name <pipeline_name>');
    });
  });

  it('should reject when name argument validation fails', () => {
    stubbedArgumentValidator.validateNotNull.throws(new Error('Boom!!'));
    getCommand(program);
    assert.that(() => {
      action.getCall(0).args[0]({});
    }).is.throwing('Boom!!');
  });

});
