const path = require('path');
const sinon = require('sinon');
const assert = require('assertthat');
const proxyquire = require('proxyquire');

const agentsIndexAPIPath = path.resolve('app/api/agents/index.js');
const loggerPath = path.resolve('app/services/logger.js');
const stubbedAgentsIndexAPI = sinon.stub();
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};

const stubbedRequires = {};

stubbedRequires[agentsIndexAPIPath] = stubbedAgentsIndexAPI;
stubbedRequires[loggerPath] = stubbedLogger;

const indexCommand = proxyquire(path.resolve('app/commands/list/agents.js'), stubbedRequires);

describe('Agents List Command', () => {
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
    stubbedAgentsIndexAPI.reset();
    stubbedLogger.info.reset();
    stubbedLogger.error.reset();
  });

  it('should set the command on the program', () => {
    indexCommand(program);
    assert.that(command.getCall(0).args[0]).is.equalTo('list_agents');
  });

  it('should set the description on the program', () => {
    indexCommand(program);
    assert.that(description.getCall(0).args[0]).is.equalTo('lists all the agents');
  });

  it('should set the option on the program', () => {
    indexCommand(program);
    assert.that(option.getCall(0).args[0]).is.equalTo('-s, --state <agent_state>');
    assert.that(option.getCall(0).args[1]).is.equalTo('state of the agent');
  });

  it('should make api call to agents index on action', () => {
    stubbedAgentsIndexAPI.resolves(JSON.stringify({}));
    indexCommand(program);
    return action.getCall(0).args[0]({}).then(() => {
      assert.that(stubbedAgentsIndexAPI.callCount).is.equalTo(1);
    });
  });

  it('should log result of action on success', () => {
    const agentsList = JSON.stringify({});

    stubbedAgentsIndexAPI.resolves(agentsList);
    indexCommand(program);
    return action.getCall(0).args[0]({}).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo(agentsList);
    });
  });

  it('should show agents filtered by state', () => {
    const res = {
      '_embedded': {
        'agents': [
          {
            'uuid': 'agent-1',
            'agent_state': 'Idle'
          },
          {
            'uuid': 'agent-2',
            'agent_state': 'Missing'
          }
        ]
      }
    };

    const filteredAgents = {
      '_embedded': {
        'agents': [
          {
            'uuid': 'agent-1',
            'agent_state': 'Idle'
          }
        ]
      }
    };
    const agentsList = JSON.stringify(res);

    stubbedAgentsIndexAPI.resolves(agentsList);
    indexCommand(program);
    return action.getCall(0).args[0]({'state': 'Idle'}).then(() => {
      assert.that(stubbedLogger.info.getCall(0).args[0]).is.equalTo(JSON.stringify(filteredAgents, null, 2));
    });
  });

  it('should log result of action on error', () => {
    const error = new Error('Boom!!');

    stubbedAgentsIndexAPI.rejects(error);
    indexCommand(program);
    return action.getCall(0).args[0]({}).then(() => {
      assert.that(stubbedLogger.error.getCall(0).args[0]).is.equalTo({});
    });
  });

});
