const { searchFilesXml } = require('../controller/fileManager')

describe('File Manager', () => {

  test('directory read successfully ', () => {
    const dirPath = `${__dirname}/res/exemplo1`
    const pathFiles = searchFilesXml(dirPath)

    expect(pathFiles).toEqual({files: ['exemplo.xml'], path: dirPath})
  })

  test('must return an array when directory does not exist', () => {
    const dirPath = `${__dirname}/res/naoexiste`
    const pathFiles = searchFilesXml(dirPath)

    expect(pathFiles).toEqual({files: [], path: dirPath})
  })  
})

