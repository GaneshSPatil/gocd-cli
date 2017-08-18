const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const pipelinesStatusCommandPath = path.resolve('app/commands/status/pipeline.js');
const stageStatusCommandPath = path.resolve('app/commands/status/stage.js');

const stubbedPipelinesStatusCommand = sinon.stub();
const stubbedStagesStatusCommand = sinon.stub();

const stubbedRequires = {};

stubbedRequires[pipelinesStatusCommandPath] = stubbedPipelinesStatusCommand;
stubbedRequires[stageStatusCommandPath] = stubbedStagesStatusCommand;

const statusCommand = proxyquire(path.resolve('app/commands/status/index.js'), stubbedRequires);

describe('Status Command', () => {
  const program = {};

  afterEach(() => {
    stubbedPipelinesStatusCommand.reset();
  });

  it('should add individual get commands on the program', () => {
    statusCommand(program);

    assert.that(stubbedPipelinesStatusCommand.callCount).is.equalTo(1);
    assert.that(stubbedPipelinesStatusCommand.getCall(0).args[0]).is.equalTo(program);

    assert.that(stubbedStagesStatusCommand.callCount).is.equalTo(1);
    assert.that(stubbedStagesStatusCommand.getCall(0).args[0]).is.equalTo(program);
  });
});
