const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const agentsListCommandPath = path.resolve('app/commands/list/agents.js');
const templatesListCommandPath = path.resolve('app/commands/list/templates.js');
const environmentsListCommandPath = path.resolve('app/commands/list/environments.js');

const stubbedRequires = {};

const stubbedAgentsListCommand = sinon.stub();
const stubbedTemplatesListCommand = sinon.stub();
const stubbedEnvironmentsListCommand = sinon.stub();

stubbedRequires[agentsListCommandPath] = stubbedAgentsListCommand;
stubbedRequires[templatesListCommandPath] = stubbedTemplatesListCommand;
stubbedRequires[environmentsListCommandPath] = stubbedEnvironmentsListCommand;

const indexCommand = proxyquire(path.resolve('app/commands/list/index.js'), stubbedRequires);

describe('List Command', () => {
  const program = {};

  afterEach(() => {
    stubbedEnvironmentsListCommand.reset();
    stubbedAgentsListCommand.reset();
  });

  it('should add individual commands on the program', () => {
    indexCommand(program);

    assert.that(stubbedAgentsListCommand.callCount).is.equalTo(1);
    assert.that(stubbedAgentsListCommand.getCall(0).args[0]).is.equalTo(program);

    assert.that(stubbedEnvironmentsListCommand.callCount).is.equalTo(1);
    assert.that(stubbedEnvironmentsListCommand.getCall(0).args[0]).is.equalTo(program);

    assert.that(stubbedTemplatesListCommand.callCount).is.equalTo(1);
    assert.that(stubbedTemplatesListCommand.getCall(0).args[0]).is.equalTo(program);
  });

});
