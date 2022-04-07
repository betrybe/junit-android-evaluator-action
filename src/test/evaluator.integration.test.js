const { runStepsEvaluator } = require('../controller/evaluator.js')


describe('Evaluator Integration', () => {
    test('Must return a base64 string when parse a xml test result', () => {
        expect(runStepsEvaluator('../res/exemplo.xml'))
        .toEqual("")
    })
})