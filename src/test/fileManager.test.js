const { loadFile } = require('../controller/fileManager')

describe('File Manager', () => {

  describe('validate xml file reading', () => {
    test('xml file read successfully ', () => {
      let output = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>';
      let file = loadFile(`${__dirname}/res/exemplo.xml`)
      expect(file).toMatch(output);
    })
  
    test('read file with file not found ', () => {
      expect(() => loadFile('test.xml')).toThrow('Erro ao ler arquivo.');
    })
  
  })
})

