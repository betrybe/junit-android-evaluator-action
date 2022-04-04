[![Avaliador-Trybe](https://img.shields.io/badge/avaliador-trybe-green.svg)](https://github.com/Naereen/badges)
 [![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)

# JUnit Evaluator Action - Kotlin

Projeto em javascript responsável por avaliar proficiência do conteúdo em relação ao curso de android.

## Pré-requisitos

Action JUnitEvaluator Action Kotlin foi implementado para trabalhar com **JUnit 4** e **JUnit 5**. 

## Status

🚧 Em construção... 🚧
Prova de conceito não esta em uso


## Inputs
- ```pr_author_username``` 
  **Campo obrigatório**
  Nome do usuário responsável pelo pull request, essa informação é advinda do próprio github.


## Output 
  - ```result```
  Resultado em base 64 originário do arquivo JSON gerado apartir da execução dos testes em JUnit.


## Uso 
Para utilizar esta action é necessário adicionar ao ***.github/workflows/main.yml*** o seguinte trecho.

```bash 
- name: Run JUnit evaluation kotlin
    id: evaluator
    uses: ./.github/actions/junit-evaluator-action-kotlin
    with:
        pr_author_username: ${{ github.event.inputs.pr_author_username }}

```

## Consultando o resultado final
Adicione o seguinte trecho ao arquivo ***.github/workflows/main.yml***

```bash
  - name: Run Another step to get result 
      uses: ./.github/actions/another_step
      with:
          evaluation-data: ${{ steps.evaluator.outputs.result }}
          pr-number: ${{ github.event.inputs.pr_number }}
```
