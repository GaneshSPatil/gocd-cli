const path = require('path');

const LOGGER = require(path.resolve('app/services/logger.js'));
const argumentValidator = require(path.resolve('app/services/argumentHelper.js'));

const cctrayIndexAPI = require(path.resolve('app/api/cctray/index.js'));

module.exports = (program) => {
  const pipelineNameOption = '-p, --pipeline_name <pipeline_name>';
  const stageNameOption = '-s, --stage_name <stage_name>';
  const jobNameOption = '-j, --job_name <job_name>';

  program
    .command('status_job')
    .option(pipelineNameOption, 'Name of the pipeline')
    .option(stageNameOption, 'Name of the stage')
    .option(jobNameOption, 'Name of the job')
    .description('status of a job')
    .action((options) => {
      argumentValidator.validateNotNull(options.job_name, jobNameOption);
      argumentValidator.validateNotNull(options.stage_name, stageNameOption);
      argumentValidator.validateNotNull(options.pipeline_name, pipelineNameOption);

      return cctrayIndexAPI()
        .then((result) => {
          const jobName = `${options.pipeline_name} :: ${options.stage_name} :: ${options.job_name}`;
          const matching = result.filter((feed) => feed.name === jobName);

          if (matching.length === 0) {
            LOGGER.error(`\n error: Job '${jobName}' not found\n`);
            return;
          }
          const status = {
            'pipelineName': matching[0].pipelineName,
            'stageName': matching[0].stageName,
            'jobName': matching[0].jobName,
            'status': matching[0].status,
            'webUrl': matching[0].webUrl
          };

          LOGGER.info(JSON.stringify(status, null, 2));
        })
        .catch(LOGGER.error);
    });
};
