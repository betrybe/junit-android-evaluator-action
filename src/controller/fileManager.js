
const fs = require('fs');
const path = require("path");
const core = require('@actions/core');

/**
 * Retorna todos os arquivos xml's
 * @param {string} pathFiles Caminho dos arquivos xml
 * @example searchFilesXml()
 * @output [ 'exemplo.xml' ]
 * 
 */
function searchFilesXml(pathFiles) {
  let files
  try {
    files = fs.readdirSync(pathFiles)
    core.info(`\u001b[48;5;6m📜 FILES -> ${files}`)

    files = files.filter((file) => path.extname(file) === ".xml")
    return files
  } catch (error) {
    core.error(`\u001b[48;2;255;0;0❌ error -> ${error}`)

    throw new Error('Erro ao buscar por arquivos xml.')
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
  let xml_string;
  try {
    // xml_string = fs.readFileSync(path.resolve(__dirname, pathFile), "utf8");
    xml_string = fs.readFileSync(pathFile, "utf8");
    return xml_string
  } catch (error) {
    throw new Error('Erro ao ler arquivo.')
  }

}


/**
 * Retorna a string gerada pela leitura de um arquivo.xml atraves de um url arquivo xml.
 * @param {string} url
 * @example loadFileUsingUrl("https://getxml.com.br/arquivo.xml")
 * @output 
 * <?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="com.example.myapplication_teste.ExampleUnitTest" tests="1" skipped="0" failures="0" errors="0" timestamp="2022-03-24T12:26:35" hostname="vostro" time="0.001">
      <properties/>
      <testcase name="addition_isCorrect" classname="com.example.myapplication_teste.ExampleUnitTest" time="0.001"/>
      <system-out><![CDATA[]]></system-out>
      <system-err><![CDATA[]]></system-err>
    </testsuite>
  @author Kátia Cibele
 */
 function loadFileUsingUrl(url) {

  let req = http.get(url, function(res) {
    let data = '';
    res.on('data', function(stream) {
        data += stream;
    });
    res.on('end', function(){
        parser.parseString(data, function(error, result) {
            if(error === null) {
                return result;
            }
            else {
                throw error;
            }
        });
    });
  });
}

/**
 * Escreve um objeto json em um arquivo result.json
 * @param {object} contentJson 
 * @param {string} nameFile 
 * @example writeJsonFile({
  "github_username": "username_github",
  "evaluations": [
    {
      "grade": 1,
      "description": "1 - Verificacao 1"
    },
    {
      "grade": 3,
      "description": "2 - Verificacao 2"
    }
  ]
}, "result.json")
 * @author Kátia Cibele
 */
function writeJsonFile(contentJson, nameFile) {
  fs.writeFile(nameFile, contentJson, (err) => {
    if(err) {
      throw new Error('Erro ao criar arquivo.')
    }
  })
}


module.exports = {
  loadFile,
  loadFileUsingUrl,
  searchFilesXml,
  writeJsonFile
}
