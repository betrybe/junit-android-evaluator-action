const core = require('@actions/core')

/**
 * @param {string} unitTestOutput 
 * @param {string} instrumentedTestOutput 
 * @returns {string}
 */
function processingOutputTests(unitTestOutput, instrumentedTestOutput) {
  try {

    core.info('\u001b[48;5;6m[info] 🖇 Unindo outputs de testes instrumentados e testes unitários.')
    return generateObjectFromOutputs(unitTestOutput, instrumentedTestOutput)

  } catch (error) {
    core.setFailed(`${error}`)
  }
}


/** Unifica outputs de testes instrumentados e testes unitários
 * @param {string} unitTestOut string em base64 do objeto dos testes unitarios
 * @param {string} instrumentedTestOut string em base64 
 * @returns {string}  { 
    github_username: '',
    github_repository: '',
    evaluations: []
  }
 */
function generateObjectFromOutputs(unitTestOut, instrumentedTestOut) {
  try {

    let unitTestObject = parserBase64ToObject(unitTestOut)
    let instrumentedTestObject = parserBase64ToObject(instrumentedTestOut)
  
    let evaluationsList = concatOutputs(unitTestObject, instrumentedTestObject)
  
    return  { 
      github_username: unitTestObject.github_username,
      github_repository: unitTestObject.github_repository,
      evaluations: evaluationsList
    }
  } catch (error) { 
    throw error 
  }
  
}


/** 
 * Decodifica base64 para objeto
 * @param {string} data string em base64 do objeto
 * @returns {object}  { 
    github_username: '',
    github_repository: '',
    evaluations: []
  }
 */
function parserBase64ToObject(data) {

  try {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
  }catch (_) {
    throw new Error('Erro ao converter base 64 para objeto.')
  }
}

/** 
 * Concatena listas de evaluations
 * @param {Object} data string em base64 do objeto
 * @example concatOuputs({github_username: 'user1',
    github_repository: 'repo',
    evaluations: [{grade: 1, description: 'descricao 1'}]}, {github_username: 'user1',
    github_repository: 'repo',
    evaluations: [{grade: 2, description: 'descricao 2'}]})
 * @returns {Array} [{grade: 1, description: 'descricao 1'}, {grade: 2, description: 'descricao 2'}]
 */
function concatOutputs(objTest1, objTest2) {
  try {
    return objTest1.evaluations.concat(objTest2.evaluations) 
  } catch (_) {
    throw new Error('Erro ao unificar outputs.')
  }
}

module.exports = {
  processingOutputTests,
  generateObjectFromOutputs
}
