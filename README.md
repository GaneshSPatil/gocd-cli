# GoCD CLI

GoCD CLI provides a fluent interface to manage GoCD.

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

## Available Commands

### list agents
```
gocd list agents
```

### list agents by state
```
gocd list agents --state='Missing'
```

### list templates
```
gocd list templates
```

### list environments
```
gocd list environments
```

### get a pipeline  
```
gocd get pipeline --name='up42' 
```

### get an agent  
```
gocd get agent --uuid="ee9f822b-eb66-4c1b-996b-c9e62a9e4241" 
```

### get an environment  
```
gocd get environment -n 'dev' 
```

### help
```
gocd --help
```