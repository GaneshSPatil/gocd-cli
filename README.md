# GoCD CLI  [![Build Status](https://travis-ci.org/GaneshSPatil/gocd-cli.svg?branch=master)](https://travis-ci.org/GaneshSPatil/gocd-cli) [![npm version](https://badge.fury.io/js/gocd.svg)](https://badge.fury.io/js/gocd) [![Coverage Status](https://coveralls.io/repos/GaneshSPatil/gocd-cli/badge.svg?branch=master)](https://coveralls.io/r/GaneshSPatil/gocd-cli?branch=master) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

a fluent CLI-based access to GoCD API for managing your CI.

## Installation

```bash
$ npm install -g gocd
```

## Quick Start

First you need to configure GoCD CLI to access your GoCD server application.
```
gocd configure --location='https://build.gocd.org' --username='admin' --password='badger'
```

Now you are able to use the various commands.

## Interact with Agents
```
gocd get agent --uuid="ee9f822b-eb66-4c1b-996b-c9e62a9e4241"
gocd list agents
gocd list agents --state='Missing'
```

## Interact with Templates
```
gocd get template --name="Dev"
gocd list templates
```

## Interact with Environments
```
gocd get environment -n 'dev'
gocd list environments
```

## Interact with Pipelines
```
gocd get pipeline --name='up42' 
```

## Trigger
``` 
gocd trigger pipeline --name='up42'
```

## Status
``` 
gocd status pipeline --name='up42'
gocd status stage --pipeline_name="up42" --stage_name="up42_stage"
gocd status job --pipeline_name="up42" --stage_name="up42_stage" --job_name="up42_job"
```

### help
```
gocd --help
```
