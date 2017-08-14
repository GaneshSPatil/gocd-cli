const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const templateGetAPIPath = path.resolve('app/api/templates/get.js');
const loggerPath = path.resolve('app/services/logger.js');
const argumentValidatorPath = path.resolve('app/services/argumentHelper.js');

const stubbedtemplatesGetAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const stubbedArgumentValidator = {'validateNotNull': sinon.stub()};

const stubbedRequires = {};

stubbedRequires[templateGetAPIPath] = stubbedtemplatesGetAPI;
stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[argumentValidatorPath] = stubbedArgumentValidator;

const getCommand = proxyquire(path.resolve('app/commands/get/template.js'), stubbedRequires);

describe('templates Get Command', () => {
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
    assert.that(command.getCall(0).args[0]).is.equalTo('get_template');
  });

  it('should set the description on the program', () => {
    getCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('get a template');
  });

  it('should make api call to template get on action', () => {
    const options = {'name': 'dev'};

    stubbedtemplatesGetAPI.resolves({});
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedtemplatesGetAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const template = {};
    const options = {'name': 'dev'};

    stubbedtemplatesGetAPI.resolves(template);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');
    const options = {'name': 'dev'};

    stubbedtemplatesGetAPI.rejects(error);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should validate name argument option', () => {
    const template = {};
    const options = {'name': 'dev'};

    stubbedtemplatesGetAPI.resolves(template);
    getCommand(program);
    return action.getCall(0).args[0](options).then(() => {
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[0]).is.equalTo('dev');
      assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[1]).is.equalTo('-n, --name <template_name>');
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
