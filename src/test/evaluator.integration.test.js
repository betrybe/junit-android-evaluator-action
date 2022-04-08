const { runStepsEvaluator } = require('../controller/evaluator.js')
const path = require("path");


describe('Evaluator Integration', () => {
    test('Must return a base64 string when parse a xml test result', () => {
        const expected = runStepsEvaluator(path.resolve(__dirname, '../test/res/exemplo1'))
        const obj = {
            "github_username":"user",
            "github_repository":"project_test_example",
            "evaluations":[
                {"grade":1,"description":"addition_isIcorrect"},
                {"grade":3,"description":"addition_isCorrect"}
            ]
        }

        expect(expected)
        .toEqual("eyJnaXRodWJfdXNlcm5hbWUiOm51bGwsImdpdGh1Yl9yZXBvc2l0b3J5IjpudWxsLCJldmFsdWF0aW9ucyI6W3siZ3JhZGUiOjN9XX0=")
    })

    test('Must merge to xml file to generate a base64', () => {
        const expected = runStepsEvaluator(path.resolve(__dirname, '../test/res/exemplo2'));

        expect(runStepsEvaluator(path.resolve(__dirname, '../test/res/exemplo2')))
        .toEqual("eyJnaXRodWJfdXNlcm5hbWUiOm51bGwsImdpdGh1Yl9yZXBvc2l0b3J5IjpudWxsLCJldmFsdWF0aW9ucyI6W3siZ3JhZGUiOjN9LHsiZ3JhZGUiOjN9XX0=")
    })
})