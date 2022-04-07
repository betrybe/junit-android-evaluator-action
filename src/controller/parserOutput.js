const core = require('@actions/core');
const unitTestOutput = core.getInput('unit-test-output', { required: false });
const instrumentedTestOutput = core.getInput('instrumented-test-output', { required: false });

function processingOutput() {
  
  // Dada entrada base 64, decodificar pra json ou object
  let unitTestObject = parserBase64ToObject(unitTestOutput);
  let instrumentedTestObject = parserBase64ToObject(instrumentedTestOutput);
  // joined
  let evaluationsList = unitTestObject.evaluations.concat(instrumentedTestObject.evaluations) 
  
  // retornar objeto mergeado
  return  { 
    github_username: unitTestObject.github_username,
    github_repository: unitTestObject.github_repository,
    evaluations: evaluationsList
  }
}


function parserJSONtoBase64(content_json) {
  return Buffer.from(content_json).toString('base64')
}

function parserBase64ToObject(data) {
  
  return Buffer.from(data, 'base64').toString('utf8')
}
