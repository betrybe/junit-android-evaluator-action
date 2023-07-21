const { spawn } = require('child_process')
const core = require('@actions/core')

const runTestUnit = () => {
  const command = './gradlew test'
  const childProcess = spawn(command, { shell: true })

  try {
    childProcess.stdout.on('data', (data) => {
      core.info(`\u001b[38;5;6m[info] Saída do comando: ${data}`)
    })

    childProcess.stderr.on('data', (data) => {
      core.setFailed(`\u001b[38;5;6m[erro]  EXEC -> Erro no comando bash: ${data}`)
    })

    childProcess.on('close', (code) => {
      core.info('\u001b[38;5;6m[info] Iniciando análise de testes unitários')

      report = runStepsEvaluator()
      core.setOutput('result > test', report)
      core.notice(`\u001b[32;5;6m 🚀 Processo concluído -> ${report}`)
      return report
    })
   
  } catch (error) {
    core.setOutput('result > test', error)
    core.setFailed(`${error}`)
    return error
  }

}


const run = () => {
  runTestUnit()
}

module.exports = { 
  run
}