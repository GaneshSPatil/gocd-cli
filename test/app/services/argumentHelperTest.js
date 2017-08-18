const path = require('path');
const assert = require('assertthat');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const loggerPath = path.resolve('app/services/logger.js');

const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};

const stubbedFs = {'existsSync': sinon.stub()};

const stubbedRequires = {};

stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires.fs = stubbedFs;

const argumentHelper = proxyquire(path.resolve('app/services/argumentHelper.js'), stubbedRequires);


describe('Argument Validator', () => {
  let stubbedExit;

  beforeEach(() => {
    stubbedExit = sinon.stub();
    process.exit = stubbedExit;
  });

  afterEach(() => {
    stubbedExit.reset();
    stubbedLogger.error.reset();
    stubbedLogger.info.reset();
  });

  describe('validateNotNull', () => {
    it('should validate argument for not null value', () => {
      const arg = 'some-value';
      const option = '--option';

      argumentHelper.validateNotNull(arg, option);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should throw when argument is not provided', () => {
      const arg = undefined; //eslint-disable-line
      const option = '--option';

      argumentHelper.validateNotNull(arg, option);

      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo('\n error: option \'--option\' argument missing \n');
      assert.that(stubbedExit.getCall(0).args[0]).is.equalTo(1);
    });
  });

  describe('parse', () => {
    it('should concat list command arguments', () => {
      const args = ['node', 'foo', 'list', 'something'];
      const expectedArgs = ['node', 'foo', 'list_something'];

      assert.that(argumentHelper.parse(args)).is.equalTo(expectedArgs);
    });

    it('should concat get command arguments', () => {
      const args = ['node', 'foo', 'get', 'something'];
      const expectedArgs = ['node', 'foo', 'get_something'];

      assert.that(argumentHelper.parse(args)).is.equalTo(expectedArgs);
    });

    it('should concat trigger command arguments', () => {
      const args = ['node', 'foo', 'trigger', 'something'];
      const expectedArgs = ['node', 'foo', 'trigger_something'];

      assert.that(argumentHelper.parse(args)).is.equalTo(expectedArgs);
    });

    it('should concat status command arguments', () => {
      const args = ['node', 'foo', 'status', 'something'];
      const expectedArgs = ['node', 'foo', 'status_something'];

      assert.that(argumentHelper.parse(args)).is.equalTo(expectedArgs);
    });

    it('should do nothing for any other command arguments', () => {
      const args = ['node', 'foo', 'configure'];

      assert.that(argumentHelper.parse(args)).is.equalTo(args);
    });
  });

  describe('validateNotEmpty', () => {
    it('should validate command is specified', () => {
      argumentHelper.validateNotEmpty(['node', 'foo', 'something']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should error when command is not specified', () => {
      argumentHelper.validateNotEmpty(['node', 'foo']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(1);
      assert.that(stubbedExit.callCount).is.equalTo(1);

      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo('\n error: command not found!! \n');
      assert.that(stubbedExit.getCall(0).args[0]).is.equalTo(1);
    });
  });

  describe('validateAuthSpecified', () => {
    it('should not validate auth specified check for help command (--help)', () => {
      argumentHelper.validateAuthSpecified(['node', 'foo', '--help']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should not validate auth specified check for help command (-h)', () => {
      argumentHelper.validateAuthSpecified(['node', 'foo', '-h']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should not validate auth specified check for configure command', () => {
      argumentHelper.validateAuthSpecified(['node', 'foo', 'configure']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should error when auth is not specified', () => {
      argumentHelper.validateAuthSpecified(['node', 'foo', 'list']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(1);
      assert.that(stubbedExit.callCount).is.equalTo(1);

      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo('\n error: cli auth not configured!!\n');
      assert.that(stubbedExit.getCall(0).args[0]).is.equalTo(1);
    });

    it('should not error when auth is specified', () => {
      stubbedFs.existsSync.returns(true);
      argumentHelper.validateAuthSpecified(['node', 'foo', 'list']);

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });
  });

  describe('validateAnyOf', () => {
    it('should not validate for undefined arg', () => {
      argumentHelper.validateAnyOf();

      assert.that(stubbedLogger.error.callCount).is.equalTo(0);
      assert.that(stubbedExit.callCount).is.equalTo(0);
    });

    it('should throw error when specified arg is not present in the allOptions', () => {
      argumentHelper.validateAnyOf('ten', ['one', 'two', 'three'], '--count');

      assert.that(stubbedLogger.error.callCount).is.equalTo(1);
      assert.that(stubbedLogger.error.callCount).is.equalTo(1);

      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo('\n error: invalid value \'ten\' specified for option \'--count\' \n');
      assert.that(stubbedExit.getCall(0).args[0]).is.equalTo(1);
    });

  });
});
