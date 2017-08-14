# GoCD CLI

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

### help
```
gocd --help
```
