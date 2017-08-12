const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const loggerPath = path.resolve('app/services/logger.js');
const argumentValidatorPath = path.resolve('app/services/argumentHelper.js');
const systemPropertiesPath = path.resolve('app/configs/systemProperties.js');

const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};

const stubbedfs = {'writeFileSync': sinon.stub()};

const stubbedArgumentValidator = {'validateNotNull': sinon.stub()};
const stubbedSystemProperties = {
  'DATA_FOLDER_PATH': 'data-folder-path',
  'GO_CONFIG_FILE_PATH': 'go-config-file-path'
};
const stubbedRequires = {};

stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[argumentValidatorPath] = stubbedArgumentValidator;
stubbedRequires[systemPropertiesPath] = stubbedSystemProperties;
stubbedRequires.fs = stubbedfs;

const configureCommand = proxyquire(path.resolve('app/commands/configure/index.js'), stubbedRequires);

/* eslint no-trailing-spaces:0*/
describe('Configure Command', () => {
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
    stubbedfs.writeFileSync.reset();
  });

  it('should set the command on the program', () => {
    configureCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('configure');
  });

  it('should set the description on the program', () => {
    configureCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('configure cli authentication');
  });

  it('should set the options on the program', () => {
    configureCommand(program);

    assert.that(option.callCount).is.equalTo(3);

    assert.that(option.getCall(0).args[0]).is.equalTo('-l, --location <location>');
    assert.that(option.getCall(0).args[1]).is.equalTo('GoCD server url');

    assert.that(option.getCall(1).args[0]).is.equalTo('-u, --username <username>');
    assert.that(option.getCall(1).args[1]).is.equalTo('GoCD admin username');

    assert.that(option.getCall(2).args[0]).is.equalTo('-p, --password <password>');
    assert.that(option.getCall(2).args[1]).is.equalTo('GoCD admin password');
  });

  it('should validate name argument option', () => {
    const options = {
      'location': 'go-server-url',
      'username': 'username',
      'password': 'password'
    };

    configureCommand(program);
    action.getCall(0).args[0](options);

    assert.that(stubbedArgumentValidator.validateNotNull.callCount).is.equalTo(3);

    assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[0]).is.equalTo('go-server-url');
    assert.that(stubbedArgumentValidator.validateNotNull.getCall(0).args[1]).is.equalTo('-l, --location <location>');

    assert.that(stubbedArgumentValidator.validateNotNull.getCall(1).args[0]).is.equalTo('username');
    assert.that(stubbedArgumentValidator.validateNotNull.getCall(1).args[1]).is.equalTo('-u, --username <username>');

    assert.that(stubbedArgumentValidator.validateNotNull.getCall(2).args[0]).is.equalTo('password');
    assert.that(stubbedArgumentValidator.validateNotNull.getCall(2).args[1]).is.equalTo('-p, --password <password>');
  });

  it('should save specified options in goconfig file', () => {
    const options = {
      'location': 'go-server-url',
      'username': 'username',
      'password': 'password'
    };

    const expectedConfig = JSON.stringify({
      'GOCD_SERVER_URL': options.location,
      'GOCD_SERVER_USERNAME': options.username,
      'GOCD_SERVER_PASSWORD': options.password
    });

    configureCommand(program);
    action.getCall(0).args[0](options);

    assert.that(stubbedfs.writeFileSync.callCount).is.equalTo(1);

    assert.that(stubbedfs.writeFileSync.getCall(0).args[0]).is.equalTo('go-config-file-path');
    assert.that(stubbedfs.writeFileSync.getCall(0).args[1]).is.equalTo(expectedConfig);
  });

});
