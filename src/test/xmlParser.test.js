const { loadFile } = require('../controller/fileManager')
const { parserXmlToObject } = require('../controller/xmlParser')

describe('XMl parser', () => { 

  describe('validate by parsing from xml to object', () => {
    test('parse with a valid xml successfully', () => {
      let file = loadFile(`${__dirname}/res/exemplo.xml`);
      let output = parserXmlToObject(file);
      let expected = 'testsuite\":{\"$\":{\"name\":\"com.example.myapplication_teste.ExampleUnitTest\",\"tests\":\"3\"'
      expect(JSON.stringify(output)).toMatch(expected)
    })
  
    test('parse with a invalid xml.', () => {
      let err = new Error("Invalid xml for parsing.");
      expect(parserXmlToObject("")).toEqual(err);
    })
  })

})

