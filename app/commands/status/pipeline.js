const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const cctrayIndexAPI = require(path.resolve('app/api/cctray/index.js'));

module.exports = (program) => {
  const nameOption = '-n, --name <pipeline_name>';

  program
    .command('status_pipeline')
    .option(nameOption, 'Name of the pipeline')
    .description('status of a pipeline')
    .action((options) => {
      argumentValidator.validateNotNull(options.name, nameOption);
      return cctrayIndexAPI()
        .then((result) => {
          const matching = result.filter((feed) => feed.pipelineName === options.name);

          if (matching.length === 0) {
            LOGGER.error(`\n error: Pipeline '${options.name}' not found\n`);
            return;
          }
          const status = {
            'pipelineName': matching[0].pipelineName,
            'stageName': matching[0].stageName,
            'status': matching[0].status,
            'webUrl': matching[0].webUrl
          };

          LOGGER.info(JSON.stringify(status, null, 2));
        })
        .catch(LOGGER.error);
    });
};
