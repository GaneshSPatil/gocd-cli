const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const pipelineTriggerAPI = require(path.resolve('app/api/pipelines/trigger.js'));

module.exports = (program) => {
  const nameOption = '-n, --name <pipeline_name>';

  program
    .command('trigger_pipeline')
    .option(nameOption, 'Name of the pipeline')
    .description('trigger a pipeline')
    .action((options) => {
      argumentValidator.validateNotNull(options.name, nameOption);
      return pipelineTriggerAPI(options.name)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
