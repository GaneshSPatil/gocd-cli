const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const environmentsListCommandPath = path.resolve('app/commands/list/environments.js');
const agentsListCommandPath = path.resolve('app/commands/list/agents.js');

const stubbedRequires = {};

const stubbedEnvironmentsListCommand = sinon.stub();
const stubbedAgentsListCommand = sinon.stub();

stubbedRequires[environmentsListCommandPath] = stubbedEnvironmentsListCommand;
stubbedRequires[agentsListCommandPath] = stubbedAgentsListCommand;

const indexCommand = proxyquire(path.resolve('app/commands/list/index.js'), stubbedRequires);

describe('List Command', () => {
  const program = {};

  afterEach(() => {
    stubbedEnvironmentsListCommand.reset();
    stubbedAgentsListCommand.reset();
  });

  it('should add individual commands on the program', () => {
    indexCommand(program);

    assert.that(stubbedEnvironmentsListCommand.callCount).is.equalTo(1);
    assert.that(stubbedEnvironmentsListCommand.getCall(0).args[0]).is.equalTo(program);

    assert.that(stubbedAgentsListCommand.callCount).is.equalTo(1);
    assert.that(stubbedAgentsListCommand.getCall(0).args[0]).is.equalTo(program);
  });

});
