const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelinesGetCommandPath = path.resolve('app/commands/get/pipeline.js');
const agentsGetCommandPath = path.resolve('app/commands/get/agent.js');
const stubbedPipelinesGetCommand = sinon.stub();
const stubbedAgentsGetCommand = sinon.stub();

const stubbedRequires = {};

stubbedRequires[pipelinesGetCommandPath] = stubbedPipelinesGetCommand;
stubbedRequires[agentsGetCommandPath] = stubbedAgentsGetCommand;

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

    assert.that(stubbedAgentsGetCommand.callCount).is.equalTo(1);
    assert.that(stubbedAgentsGetCommand.getCall(0).args[0]).is.equalTo(program);
  });

});
