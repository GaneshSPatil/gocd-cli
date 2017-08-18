const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const cctrayIndexAPI = require(path.resolve('app/api/cctray/index.js'));

module.exports = (program) => {
  const pipelineNameOption = '-p, --pipeline_name <pipeline_name>';
  const stageNameOption = '-s, --stage_name <stage_name>';

  program
    .command('status_stage')
    .option(pipelineNameOption, 'Name of the pipeline')
    .option(stageNameOption, 'Name of the stage')
    .description('status of a stage')
    .action((options) => {
      argumentValidator.validateNotNull(options.stage_name, stageNameOption);
      argumentValidator.validateNotNull(options.pipeline_name, pipelineNameOption);

      return cctrayIndexAPI()
        .then((result) => {
          const stageName = `${options.pipeline_name} :: ${options.stage_name}`;
          const matching = result.filter((feed) => feed.name === stageName);

          if (matching.length === 0) {
            LOGGER.error(`\n error: Stage '${stageName}' not found\n`);
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
