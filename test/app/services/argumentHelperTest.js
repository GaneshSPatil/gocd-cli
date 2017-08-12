const path = require('path');
const assert = require('assertthat');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const loggerPath = path.resolve('app/services/logger.js');
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const stubbedRequires = {};

stubbedRequires[loggerPath] = stubbedLogger;

const argumentHelper = proxyquire(path.resolve('app/services/argumentHelper.js'), stubbedRequires);


describe('Argument Validator', () => {
  let stubbedExit;

  beforeEach(() => {
    stubbedExit = sinon.stub();
    process.exit = stubbedExit;
  });

  afterEach(() => {
    stubbedExit.reset();
  });

  describe('validateNotNull', () => {
    it('should validate argument for not null value', () => {
      const arg = 'some-value';
      const option = '--option';

      assert.that(() => {
        argumentHelper.validateNotNull(arg, option);
      }).is.not.throwing();
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
  });
});
