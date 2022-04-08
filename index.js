const { runStepsEvaluator } = require('./src/controller/evaluator')
const { processingOutputTests } = require('./src/controller/parserOutput')
const core = require('@actions/core');
const testPath = core.getInput('test-path', { required: true });
const unitTestOutput = core.getInput('unit-test-output', { required: false });
const instrumentedTestOutput = core.getInput('instrumented-test-output', { required: false });


core.notice('\u001b[38;5;6m ⚙️ Rodando avaliador');

testPath ? runStepsEvaluator(testPath) : processingOutputTests(unitTestOutput, instrumentedTestOutput)
