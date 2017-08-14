const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const templatesIndexAPIPath = path.resolve('app/api/templates/index.js');
const loggerPath = path.resolve('app/services/logger.js');
const stubbedtemplatesIndexAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};

const stubbedRequires = {};

stubbedRequires[templatesIndexAPIPath] = stubbedtemplatesIndexAPI;
stubbedRequires[loggerPath] = stubbedLogger;

const indexCommand = proxyquire(path.resolve('app/commands/list/templates.js'), stubbedRequires);

describe('templates List Command', () => {
  const command = sinon.stub();
  const description = sinon.stub();
  const action = sinon.stub();

  const program = {
    command,
    description,
    action
  };

  beforeEach(() => {
    command.returns(program);
    description.returns(program);
    action.returns(program);
  });

  afterEach(() => {
    command.reset();
    description.reset();
    action.reset();
  });

  it('should set the command on the program', () => {
    indexCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('list_templates');
  });

  it('should set the description on the program', () => {
    indexCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('lists all the templates');
  });

  it('should make api call to templates index on action', () => {
    stubbedtemplatesIndexAPI.resolves({});
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedtemplatesIndexAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const templatesList = {};

    stubbedtemplatesIndexAPI.resolves(templatesList);
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');

    stubbedtemplatesIndexAPI.rejects(error);
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

});
