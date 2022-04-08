const { runStepsEvaluator } = require('../controller/evaluator.js')
const core = require('@actions/core');
const path = require("path");

jest.mock('@actions/core');

describe('Evaluator Integration', () => {
    beforeAll(() => {
        core.getInput.mockResolvedValue('teste_user');
    });
    
    test('Must return a base64 string when parse a xml test result', () => {
        const expected = runStepsEvaluator(path.resolve(__dirname, '../test/res/exemplo1'))
        console.log(expected)
        const decodedPayload = JSON.parse(Buffer.from(expected, 'base64').toString('utf8'));

        expect(decodedPayload.evaluations).toEqual([
            { grade: 3, description: 'addition_isIcorrect' },
            { grade: 3, description: 'addition_isCorrect' },
            { grade: 3, description: 'addition_isCorrect_2' },
        ])
    })

    test('Must merge to xml file to generate a base64', () => {
        const expected = runStepsEvaluator(path.resolve(__dirname, '../test/res/exemplo2'));
        const decodedPayload = JSON.parse(Buffer.from(expected, 'base64').toString('utf8'));

        expect(decodedPayload.evaluations).toEqual([
            { grade: 3, description: 'addition_isIcorrect' },
            { grade: 3, description: 'addition_isCorrect' },
            { grade: 3, description: 'addition_isCorrect_2' },
            { grade: 3, description: 'sub_isCorrect' }
        ])
    })
})