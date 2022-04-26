const { runStepsEvaluator } = require('./src/controller/evaluator')
const core = require('@actions/core')
const unitPath = 'app/build/test-results/testReleaseUnitTest/'
const instrumentedPath = 'app/build/outputs/androidTest-results/connected/'

core.info('\u001b[38;5;6m[info] 🏃‍♂️ Rodando avaliador')


runStepsEvaluator([unitPath, instrumentedPath])