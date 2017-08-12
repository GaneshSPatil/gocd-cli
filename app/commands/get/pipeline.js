const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const pipelineGetAPI = require(path.resolve('app/api/pipelines/get.js'));

module.exports = (program) => {
  const nameOption = '-n, --name <pipeline_name>';

  program.
    command('get_pipeline')
    .option(nameOption, 'Name of the pipeline')
    .description('get a pipeline')
    .action((options) => {
      argumentValidator.validateNotNull(options.name, nameOption);
      return pipelineGetAPI(options.name)
        .then(LOGGER.info)
        .catch(LOGGER.error);
    });
};
