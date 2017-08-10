const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const environmentsIndexAPIPath = path.resolve('app/api/environments/index.js');
const loggerPath = path.resolve('app/services/logger.js');
const stubbedenvironmentsIndexAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};

const stubbedRequires = {};

stubbedRequires[environmentsIndexAPIPath] = stubbedenvironmentsIndexAPI;
stubbedRequires[loggerPath] = stubbedLogger;

const indexCommand = proxyquire(path.resolve('app/commands/list/environments.js'), stubbedRequires);

describe('environments List Command', () => {
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
    assert.that(command.getCall(0).args[0]).is.equalTo('list_environments');
  });

  it('should set the description on the program', () => {
    indexCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('lists all the environments');
  });

  it('should make api call to environments index on action', () => {
    stubbedenvironmentsIndexAPI.resolves({});
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedenvironmentsIndexAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const environmentsList = {};

    stubbedenvironmentsIndexAPI.resolves(environmentsList);
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo({});
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');

    stubbedenvironmentsIndexAPI.rejects(error);
    indexCommand(program);
    return action.getCall(0).args[0]().then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

});
