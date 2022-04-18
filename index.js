const { runStepsEvaluator } = require('./src/controller/evaluator')
const core = require('@actions/core');
const unitPath = 'app/build/test-results/testReleaseUnitTest/'
const instrumentedPath = 'app/build/outputs/androidTest-results/connected/'
const username = core.getInput('pr_author_username', { required: true });

core.info(`\u001b[38;5;6m[info] 🏃‍♂️ Rodando avaliador -> ${username} `);


runStepsEvaluator([unitPath, instrumentedPath])