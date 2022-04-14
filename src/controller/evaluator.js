const { loadFile, searchFilesXml } = require('./fileManager')
const { parserXmlToObject } = require('./xmlParser')
const core = require('@actions/core');
const { getGithubUsernameData,  getGithubRepositoryNameData } = require('./util')
require('dotenv').config()

const APPROVED_GRADE = 3;
const UNAPPROVED_GRADE = 1;

/**
 * Passo a passo
 * 1 - Busca por arquivox .xml dentro do diretorio path_xml
 * 2 - Leitura do arquivo xml gerado apartir do comando gradle para construir testes.
 * 3 - Transformar o xml lido em objeto
 * 4 - Mapeia em objeto legivel de fácil manipulação.
 * 5 - Calcular nota e cria array com todos os testcases para gerar output
 * 6 - Gera output em json
 * @example runStepsEvaluator('./src/test/res/')
 * @param {array} pathList - caminho da pasta para o xml's.
 * @return {string}
 */
function runStepsEvaluator(pathList) {
  try {

    const pathFiles = pathList
      .map((path) => searchFilesXml(path))

    const testCasesList = pathFiles.map((pathFile) => {
      return buildTestCaseList(pathFile.path, pathFile.files)
    }).reduce((acc, testType) => acc.concat(testType), []);
    
    const output = generateOuputJSON(testCasesList);
    const outputBase64 = parserJSONtoBase64(output) 

    core.setOutput('result', outputBase64);
    core.notice(`\u001b[32;5;6m 🚀 Processo concluído -> ${outputBase64}`)
    return outputBase64
  } catch(error) {
    core.setFailed(`${error}`);
  }
}

/**
 * @param {Object} content_json 
 * @returns {string}
 */
function parserJSONtoBase64(content_json) {
  return Buffer.from(content_json).toString('base64')
}

/**
 * @param {string} path 
 * @param {string[]} files 
 * @returns {Object[]}
 */
function buildTestCaseList(path, files){
  return files.map((file) => {
    const loadedFile = loadFile(`${path}/${file}`);
    const testSuite = parserXmlToObject(loadedFile)
    const objMapped = mapValuesTestSuite(testSuite);
    return objMapped.testcase
  }).reduce((acc, val) => acc.concat(val), []);
}

/**
 * Gera saida em json apartir de um objeto
 * TODO get github_username e github_repository
 * @param {*} testcaseList 
 * @example generateOuputJSON()
 * @returns
 * {
    "github_username":"katiacih",
    "github_repository":"project_test_example",     
      "evaluations":[
        {"grade":1,"description":"addition_isIncorrect"},
        {"grade":3,"description":"addition_isCorrect"}
      ]
  }
 */
function generateOuputJSON(testcaseList) {
  const username = getGithubUsernameData();
  const repository = getGithubRepositoryNameData()
  return JSON.stringify({
    github_username: username,
    github_repository: repository,
    evaluations: generateObjectEvaluations(testcaseList)
  })
}


/**
 * Para cada testcase retorna a estrutura com nota e descrição
 * @param {*} failures  Lista de failures do requisito.
 * @param {*} requirementDescription  Descrição do requisito.
 * @example getGrade( [ 
  {
    message: 'java.lang.AssertionError: expected:<7> but was:<8>',
    type: 'java.lang.AssertionError'
  }
], "Description ...")
 * @returns {
    grade: UNAPPROVED_GRADE | APPROVED_GRADE,
    description: ""
  }
 */
function getGrade( failures, requirementDescription ) {
  if(failures !== null && failures?.length > 0 ){
    return { grade: UNAPPROVED_GRADE,  description: requirementDescription }
  }
  else return { grade: APPROVED_GRADE, description: requirementDescription }
}

/**
 * Dado uma lista de testcases monta a estrutura com ojeto para gerar output
 * @param {*} testcaseList  Lista de testcases
 * @example generateObjectEvaluations([
  {
    name: 'addition_isIcorrect',
    classname: 'com.example.myapplication_teste.ExampleUnitTest',
    time: '0.004',
    failures: [ [Object] ]
  },
  {
    name: 'addition_isCorrect',
    classname: 'com.example.myapplication_teste.ExampleUnitTest',
    time: '0.0',
    failures: null
  }
  ])
* @returns  [
  { grade: 1, description: 'addition_isIcorrect' },
  { grade: 3, description: 'addition_isCorrect' }]
 */
function generateObjectEvaluations(testcaseList) {
   // [unit -> {}, instrumented -> {}]
  return testcaseList.map((testcase) => { 
    return getGrade(testcase.failures, testcase.name) 
  })
}

/**
 * Mapea um objeto testcase para analise
 * @param {obj} testcase
 * @example mapTestCase(testcase)
 * @author Kátia Cibele
 */
  function mapTestCase(testcase) {
    return testcase.map((item) => { 
      return { 
          name: item.$.name, 
          classname: item.$.classname, 
          time: item.$.time,
          failures: item.failure === undefined || item.failure?.length > 0 ? null : item.failure.map((fail) => { return { message: fail.$.message, type: fail.$.type }})
      }
    })
  }
  
  /**
   * Mapea um objeto testsuite para analise
   * @param {object} obj
   * @example mapValues({})
   * @return {object}
   */
  function mapValuesTestSuite(obj) {
    
    return { 
      name: obj.testsuite.$.name, 
      tests: obj.testsuite.$.tests, 
      skipped: obj.testsuite.$.skipped,
      failures: obj.testsuite.$.failures,
      errors: obj.testsuite.$.errors,
      timestamp: obj.testsuite.$.timestamp,
      hostname: obj.testsuite.$.hostname,
      time: obj.testsuite.$.time,
      skipped: obj.testsuite.$.skipped,
      testcase: mapTestCase(obj.testsuite.testcase)
    }
  
  };

module.exports = {
  generateObjectEvaluations,
  generateOuputJSON,
  getGrade,
  mapTestCase,
  mapValuesTestSuite,
  parserJSONtoBase64,
  runStepsEvaluator
}


