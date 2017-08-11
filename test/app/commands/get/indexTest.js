const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelinesGetCommandPath = path.resolve('app/commands/get/pipeline.js');
const stubbedPipelinesGetCommand = sinon.stub();

const stubbedRequires = {};

stubbedRequires[pipelinesGetCommandPath] = stubbedPipelinesGetCommand;

const getCommand = proxyquire(path.resolve('app/commands/get/index.js'), stubbedRequires);

describe('Get Command', () => {
  const program = {};

  afterEach(() => {
    stubbedPipelinesGetCommand.reset();
  });

  it('should add individual get commands on the program', () => {
    getCommand(program);

    assert.that(stubbedPipelinesGetCommand.callCount).is.equalTo(1);
    assert.that(stubbedPipelinesGetCommand.getCall(0).args[0]).is.equalTo(program);
  });

});
