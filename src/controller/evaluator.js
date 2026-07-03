const core = require('@actions/core')
const Base64 = require('base64-string').Base64
const { loadFile, searchFilesXml } = require('./fileManager')
const { parserXmlToObject } = require('./xmlParser')
const { getGithubUsernameData, getGithubRepositoryNameData } = require('./util')

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
    
    const testCases = pathFiles.map((pathFile) => {
      return buildTestCaseList(pathFile.path, pathFile.files)
    }).reduce((acc, testType) => acc.concat(testType), [])

    if (testCases.length === 0) {
      throw new Error(
        '💥 Os relatórios XML foram gerados sem nenhum <testcase>. ' +
        'Isso geralmente indica que o app ou o emulador crashou antes de concluir os testes ' +
        '(falha de infraestrutura, e não do código avaliado). ' +
        'Re-execute o workflow e, se o problema persistir, verifique o logcat no log do passo de testes.'
      )
    }

    const testCasesJSON = convertTestCasesToJSON(testCases)
    const testCasesInBase64 = convertTestCasesToBase64(testCasesJSON) 
    
    core.setOutput('result', testCasesInBase64)
    
    core.info('\u001b[38;5;6m[info] ✅ Avaliador finalizado.')
  } catch(error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

function convertTestCasesToBase64(testCasesJSON) {
  var enc = new Base64()
  return enc.encode(testCasesJSON)
}

function buildTestCaseList(path, files){
  return files.map((file) => {
    const loadedFile = loadFile(`${path}/${file}`)
    const testSuite = parserXmlToObject(loadedFile)
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

function convertTestCasesToJSON(testCases) {
  const username = getGithubUsernameData()
  const repository = getGithubRepositoryNameData()
  
  return JSON.stringify({
    github_username: username,
    github_repository: repository,
    evaluations: generateEvaluations(testCases)
  })
}

function generateEvaluations(testCases) {
  return testCases.map((testCase) => { 
    return {
      description: testCase.name,
      grade: testCase.failures.length > 0 ? UNAPPROVED_GRADE : APPROVED_GRADE
    }
  })
}
  
function mapValuesTestSuite(obj) {
  if (!obj || !obj.testsuite || !obj.testsuite.$) {
    throw new Error('📭 Relatório XML em formato inesperado: nó <testsuite> não encontrado.')
  }
  return {
    name: obj.testsuite.$.name,
    tests: obj.testsuite.$.tests,
    skipped: obj.testsuite.$.skipped,
    failures: obj.testsuite.$.failures,
    errors: obj.testsuite.$.errors,
    timestamp: obj.testsuite.$.timestamp,
    hostname: obj.testsuite.$.hostname,
    time: obj.testsuite.$.time,
    testcase: mapTestCase(obj.testsuite.testcase || [])
  }
}

function mapTestCase(testCase) {
  return testCase.map((item) => {     
    return { 
      name: item.$.name, 
      classname: item.$.classname, 
      time: item.$.time,
      failures: item.failure || []
    }
  })
}

module.exports = {
  runStepsEvaluator,
  mapValuesTestSuite,
  generateEvaluations
}
