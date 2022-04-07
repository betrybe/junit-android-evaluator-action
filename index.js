const { runStepsEvaluator } = require('./src/controller/evaluator')
const core = require('@actions/core');
const testPath = core.getInput('test-path', { required: true });

core.info('Running steps evaluator');
runStepsEvaluator(testPath)
