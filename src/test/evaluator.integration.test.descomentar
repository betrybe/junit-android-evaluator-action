const { runStepsEvaluator } = require('../controller/evaluator.js')
const core = require('@actions/core');
const path = require("path");

jest.mock('@actions/core');

describe('Evaluator Integration', () => {
    
    test('Must return a base64 string when parse multiple type test', () => {
        const pathList = [
            path.resolve(__dirname, '../test/res/exemplo2/instrumented'), 
            path.resolve(__dirname, '../test/res/exemplo2/unit')
        ]
        const expected = runStepsEvaluator(pathList)
        const decodedPayload = JSON.parse(Buffer.from(expected, 'base64').toString('utf8'));

        expect(decodedPayload.evaluations).toEqual([
            {"description": "sub_isCorrect", "grade": 3}, 
            {"description": "addition_isIcorrect", "grade": 3}, 
            {"description": "addition_isCorrect", "grade": 3}, 
            {"description": "addition_isCorrect_2", "grade": 3}
        ])
    })

    test('Must return a base64 string when parse only one type test', () => {
        const pathList = [
            path.resolve(__dirname, '../test/res/exemplo3/unit'),
            path.resolve(__dirname, '../test/res/exemplo3/instrumented')
        ]
        
        const expected = runStepsEvaluator(pathList)
        const decodedPayload = JSON.parse(Buffer.from(expected, 'base64').toString('utf8'));

        expect(decodedPayload.evaluations).toEqual([
            { grade: 3, description: 'addition_isIcorrect' },
            { grade: 3, description: 'addition_isCorrect' },
            { grade: 3, description: 'addition_isCorrect_2' }
        ])
    })

    test('Must return a base64 string with evaluations array empty', () => {
        const pathList = [path.resolve(__dirname, '../test/res/empty_folder')]
        const expected = runStepsEvaluator(pathList)

        expect(expected.message).toContain('📭 Nenhum arquivo encontrado para ambos os testes ->')
    })    
})