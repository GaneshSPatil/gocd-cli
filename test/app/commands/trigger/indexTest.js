const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelinesTriggerCommandPath = path.resolve('app/commands/trigger/pipeline.js');

const stubbedPipelinesTriggerCommand = sinon.stub();

const stubbedRequires = {};

stubbedRequires[pipelinesTriggerCommandPath] = stubbedPipelinesTriggerCommand;

const triggerCommand = proxyquire(path.resolve('app/commands/trigger/index.js'), stubbedRequires);

describe('Get Command', () => {
  const program = {};

  afterEach(() => {
    stubbedPipelinesTriggerCommand.reset();
  });

  it('should add individual get commands on the program', () => {
    triggerCommand(program);

    assert.that(stubbedPipelinesTriggerCommand.callCount).is.equalTo(1);
    assert.that(stubbedPipelinesTriggerCommand.getCall(0).args[0]).is.equalTo(program);
  });

});
