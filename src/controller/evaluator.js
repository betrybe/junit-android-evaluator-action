const { loadFile, searchFilesXml } = require('./fileManager')
const { parserXmlToObject } = require('./xmlParser')
const core = require('@actions/core');

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
 * @params path_xml - caminho da pasta para o xml's.
 * @return {string}
 */
function runStepsEvaluator(path_xml) {
  try {
    const filesXml = searchFilesXml(path_xml)
    let testCasesList = filesXml.map(function(fileXml) {
      const file = loadFile(`${path_xml}${fileXml}`);
      const obj = parserXmlToObject(file)
      const objMapped = mapValuesTestSuite(obj);
      objMapped.testcase
    })
    
    let output = generateOuputJSON(testCasesList);
    core.setOutput('result', parserJSONtoBase64(output));
    core.notice(`\u001b[48;5;6m[info] 🚀 Processo concluído. Resultado: ${outputBase64}`)
  } catch(error) {
    core.setFailed(`${error}`);
  }
}

/**
 * @param {Object} content_json 
 * @returns 
 */
function parserJSONtoBase64(content_json) {
  return Buffer.from(content_json).toString('base64')
}

/**
 * Gera saida em json apartir de um objeto
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
  let username = getGithubUsernameData();
  let repository = getGithubRepositoryNameData()
  return JSON.stringify({
    github_username: username,
    github_repository: repository,
    evaluations: generateObjectEvaluations(testcaseList)
  })
}


/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubUsernameData(obj)
 */
function getGithubUsernameData() {
  author = process.env.INPUT_PR_AUTHOR_USERNAME;
  if (author) return author 
  else return null;
}

/**
 * Retorna valor da variavel de ambiente.
 * @example getGithubRepositoryNameData()
 */
function getGithubRepositoryNameData() {
  repository = process.env.GITHUB_REPOSITORY;
  if(repository) return repository;
  else return null;
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
  if(failures !== null && failures.length > 0 ){
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
  let evaluations = testcaseList.map(function(testcase) { 
    return getGrade(testcase.failures, testcase.name) })
  return evaluations;
}

/**
 * Mapea um objeto testcase para analise
 * @param {obj} testcase
 * @example mapTestCase(testcase)
  @author Kátia Cibele
 */
  function mapTestCase(testcase) {
    return testcase.map(function(item) { 
        return { 
          name: item.$.name, 
          classname: item.$.classname, 
          time: item.$.time,
          failures: item.failure === undefined || item.failure.lenght > 0 ? null : item.failure.map( function (fail) { return { message: fail.$.message, type: fail.$.type }})
      }})
  }
  
  /**
   * Mapea um objeto testsuite para analise
   * @param {obj} obj
   * @example mapValues(obj)
    @author Kátia Cibele
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
  generateObjectEvaluations,
  getGithubRepositoryNameData,
  getGithubRepositoryNameData, 
  getGrade,
  mapTestCase,
  mapValuesTestSuite,
  runStepsEvaluator
}


