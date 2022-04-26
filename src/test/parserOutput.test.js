const { parserJSONtoBase64 } = require('../controller/evaluator.js')
const { generateObjectFromOutputs } = require('../controller/parserOutput.js')

describe('ParserOutput', () => {
 
  describe('Validate merges two strings in 64 bits com sucessively', () => {
    test('With two valid objects then it should return a successfully merged structure.', () => {
      const obj1 = parserJSONtoBase64(JSON.stringify({
        github_username:'katiacih',
        github_repository:'project_test_example',     
        evaluations:[
          { grade:4, description:'addition_isIncorrect'},
          { grade:7, description:'addition_isCorrect'}
        ]
      }))

      const obj2 = parserJSONtoBase64(JSON.stringify({
        github_username: 'katiacih',
        github_repository:'project_test_example',     
        evaluations:[
          {grade:1, description:'addition_isIncorrect 4343'},
          {grade:3, description:'addition_isCorrect 43432'}
        ]
      }))

      expect(generateObjectFromOutputs(obj1, obj2)).toEqual(
        {
          'github_username':'katiacih',
          'github_repository':'project_test_example',     
          'evaluations':[
            {'grade':4,'description':'addition_isIncorrect'},
            {'grade':7,'description':'addition_isCorrect'},
            {'grade':1,'description':'addition_isIncorrect 4343'},
            {'grade':3,'description':'addition_isCorrect 43432'}
          ]
        }
      )
  
    })

    test('With one of the objects without evaluations then it should return a successfully merged structure.', () => {
      const obj1 = parserJSONtoBase64(JSON.stringify({
        github_username:'katiacih',
        github_repository:'project_test_example',     
        evaluations:[
          { grade:4, description:'addition_isIncorrect'},
          { grade:7, description:'addition_isCorrect'}
        ]
      }))
      
      const obj2 = parserJSONtoBase64(JSON.stringify({
        github_username: 'katiacih',
        github_repository:'project_test_example',     
        evaluations:[]
      }))

      expect(generateObjectFromOutputs(obj1, obj2)).toEqual(
        {
          'github_username':'katiacih',
          'github_repository':'project_test_example',     
          'evaluations':[
            {'grade':4,'description':'addition_isIncorrect'},
            {'grade':7,'description':'addition_isCorrect'}
          ]
        }
      )
  
    })

    test('Given two base64 with the first invalid object then it should return an object successfully.', () => {
      const obj1 = parserJSONtoBase64(JSON.stringify({
        github_username:'katiacih',
        github_repository:'project_test_example',     
        evaluations: []
      }))

      const obj2 = parserJSONtoBase64(JSON.stringify({
        github_username: 'katiacih',
        github_repository:'project_test_example',     
        evaluations:[
          {grade:1, description:'addition_isIncorrect 4343'},
          {grade:3, description:'addition_isCorrect 43432'}
        ]
      }))

      expect(generateObjectFromOutputs(obj1, obj2)).toEqual(
        {
          'github_username':'katiacih',
          'github_repository':'project_test_example',     
          'evaluations':[
            {'grade':1,'description':'addition_isIncorrect 4343'},
            {'grade':3,'description':'addition_isCorrect 43432'}
          ]
        }
      )
  
    })


    test('Given undefined input should return error', () => {
      const error = new Error ('Erro ao converter base 64 para objeto.')
      expect(() => generateObjectFromOutputs(null, null)).toThrowError(error)
    })

    test('Given an incomplete object should return error when merging evaluations', () => {
      const obj1 = parserJSONtoBase64(JSON.stringify({
        github_username:'katiacih',
        github_repository:'project_test_example',     
      }))
      
      const obj2 = parserJSONtoBase64(JSON.stringify({
        github_username: 'katiacih',
        github_repository:'project_test_example',     
        evaluations:[
          {grade:1, description:'addition_isIncorrect 4343'},
          {grade:3, description:'addition_isCorrect 43432'}
        ]
      }))
      
      error = new Error ('Erro ao unificar outputs.')
      expect(() => generateObjectFromOutputs(obj1, obj2)).toThrowError(error)
    })
  })

})