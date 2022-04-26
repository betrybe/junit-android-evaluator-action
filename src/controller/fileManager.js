
const fs = require('fs')
const path = require('path')
const core = require('@actions/core')

/**
 * Retorna todos os arquivos xml's
 * @param {string} dirPath Caminho dos arquivos xml
 * @example searchFilesXml()
 * @output {files: [ 'exemplo.xml' ], path: dirPath} 
 * 
 */
function searchFilesXml(dirPath) {
  try {
    core.info(`\u001b[38;5;6m[info] 🔍 Buscando arquivos xml -> ${dirPath}`)
    
    let files = fs.readdirSync(dirPath)
    files = files.filter((file) => path.extname(file) === '.xml')
    core.info(`\u001b[38;5;6m[info] 📑 Arquivos encontrados -> ${files.length}`)
    
    return {files, path: dirPath}  
  } catch (error) {
    core.info('\u001b[38;5;6m[info] 📑 Arquivos encontrados -> 0')
    return {files: [], path: dirPath}
  }
}

/** 
 * Retorna a string gerada pela leitura do arquivo xml.
 * @param {string} pathFile 
 * @example loadFile("file.xml")
 * @output 
 * <?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="com.example.myapplication_teste.ExampleUnitTest" tests="1" skipped="0" failures="0" errors="0" timestamp="2022-03-24T12:26:35" hostname="vostro" time="0.001">
      <properties/>
      <testcase name="addition_isCorrect" classname="com.example.myapplication_teste.ExampleUnitTest" time="0.001"/>
      <system-out><![CDATA[]]></system-out>
      <system-err><![CDATA[]]></system-err>
    </testsuite>
 * @author Kátia Cibele
 */
// function loadFile(pathFile) {
//   let xml_string;
//     fs.readFile(path.resolve(__dirname, pathFile), { encoding:'utf8', flag:'r'}, function (err, data) {
//       if(err) throw new Error(err);
//       else xml_string = data;
//     }); 
// }
function loadFile(pathFile) {
  let xml_string
  try {
    xml_string = fs.readFileSync(pathFile, 'utf8')
    return xml_string
  } catch (error) {
    throw new Error('Erro ao ler arquivo.')
  }

}

module.exports = {
  loadFile,
  searchFilesXml
}
