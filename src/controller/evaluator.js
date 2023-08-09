const core = require('@actions/core')
const Base64 = require('base64-string').Base64
const { loadFile, searchFilesXml } = require('./fileManager')
const { parserXmlToObject } = require('./xmlParser')
const { getGithubUsernameData,  getGithubRepositoryNameData } = require('./util')

const APPROVED_GRADE = 3
const UNAPPROVED_GRADE = 1

/**
 * Passo a passo
 * 1 - Busca por arquivos .xml dentro do diretorio path_xml
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
    const pathFiles = getTestFiles(pathList)
    console.log('pathFiles')
    console.log(pathFiles)
    const testCasesList = pathFiles.map((pathFile) => {
      return buildTestCaseList(pathFile.path, pathFile.files)
    }).reduce((acc, testType) => acc.concat(testType), [])
    
    const output = generateOutputJSON(testCasesList)
    const outputBase64 = parserJSONtoBase64(output) 
    
    core.setOutput('result', outputBase64)
    
    core.info('\u001b[38;5;6m[info] 🏃‍♂️ Avaliador finalizado')
  } catch(error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

/**
 * @param {Object} content_json 
 * @returns {string}
 */
function parserJSONtoBase64(content_json) {
  var enc = new Base64()
  return enc.encode(content_json)
}

/**
 * @param {string} path 
 * @param {string[]} files 
 * @returns {Object[]}
 */
function buildTestCaseList(path, files){
  return files.map((file) => {
    const loadedFile = loadFile(`${path}/${file}`)
    const testSuite = parserXmlToObject(loadedFile)
    console.log('testando...')
    console.log(testSuite)
    const objMapped = mapValuesTestSuite(testSuite)
    return objMapped.testcase
  }).reduce((acc, val) => acc.concat(val), [])
}

function getTestFiles(pathList) {
  const pathFiles = pathList.map((path) => searchFilesXml(path))

  const noFile = !pathFiles.find((path) => {
    return path.files.length > 0
  })

  if(noFile) throw new Error(`📭 Nenhum arquivo encontrado para ambos os testes -> ${pathList}`)

  return pathFiles
}

/**
 * Gera saida em json apartir de um objeto
 * TODO get github_username e github_repository
 * @param {*} testcaseList 
 * @example generateOutputJSON()
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
function generateOutputJSON(testcaseList) {
  const username = getGithubUsernameData()
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
    testcase: mapTestCase(obj.testsuite.testcase)
  }
  
}

module.exports = {
  generateObjectEvaluations,
  generateOutputJSON,
  getGrade,
  mapTestCase,
  mapValuesTestSuite,
  parserJSONtoBase64,
  runStepsEvaluator
}


