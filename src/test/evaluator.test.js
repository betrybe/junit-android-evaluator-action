const { generateObjectEvaluations, mapValuesTestSuite, getGrade } = require('../controller/evaluator.js')

describe('Evaluator', () => {
 
  describe('mapped structured', () => {
    test('validate mapped structured expected for generate JSON', () => {
      let input = {
        testsuite: {
          '$': {
            name: 'com.example.myapplication_teste.ExampleUnitTest',
            tests: '3',
            skipped: '0',
            failures: '1',
            errors: '0',
            timestamp: '2022-03-24T12:41:39',
            hostname: 'vostro',
            time: '0.007'
          },
          properties: [ '' ],
          testcase: [],
          'system-out': [ '' ],
          'system-err': [ '' ]
        }
      }
      expect(mapValuesTestSuite(input)).toEqual({"errors": "0", "failures": "1", "hostname": "vostro", "name": "com.example.myapplication_teste.ExampleUnitTest", "skipped": "0", "testcase": [], "tests": "3", "time": "0.007", "timestamp": "2022-03-24T12:41:39"});
  
    })
  })
  
  describe('set Grade', () => {
    test('given a failure and requirement object must return a structure with the failing grade', () => {
      let failures = [{
        message: 'java.lang.AssertionError: expected:<7> but was:<8>',
        type: 'java.lang.AssertionError'
        }];
      
      let requirementDescription = "Description requirements"
      expect(getGrade(failures, requirementDescription)).toEqual({
        grade: 1,
        description: "Description requirements"
      })
    })
  
    test('given a failure and requirement object must return a structure with the note ', () => {
      expect(getGrade([], "Description requirements")).toEqual({
        grade: 3,
        description: "Description requirements"
      })
    })
  })
  
  describe('generate evaluations object', () => {
    test('Validates generation of evaluation objects', () => {
      let input = [
        {
          name: 'addition_isIcorrect',
          classname: 'com.example.myapplication_teste.ExampleUnitTest',
          time: '0.004',
          failures: [
            {
              message: 'java.lang.AssertionError: expected:<7> but was:<8>',
              type: 'java.lang.AssertionError'
            },
            {
              message: 'java.lang.AssertionError: expected:<7> but was:<8>',
              type: 'java.lang.AssertionError'
            }
          ]
        },
        {
          name: 'addition_isCorrect',
          classname: 'com.example.myapplication_teste.ExampleUnitTest',
          time: '0.0',
          failures: null
        }
      ]

      expect(generateObjectEvaluations(input)).toEqual( [
        { grade: 1, description: 'addition_isIcorrect' },
        { grade: 3, description: 'addition_isCorrect' }])
    })  
  })
})
