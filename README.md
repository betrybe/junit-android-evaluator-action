[![Parser-Xml-Trybe](https://img.shields.io/badge/avaliador-trybe-green.svg)](https://github.com/Naereen/badges)
 [![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)

# Parser JUnit Actions

Projeto em javascript responsável por processar saida de testes em junit e gerar estrutura conhecida para registrar notas e identificar requisitos.
## Pré-requisitos

Entrada deve ser testes em xml registrados com seguinte estrutura

``` <?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="com.example.myapplication_teste.ExampleUnitTest" tests="1" skipped="0" failures="0" errors="0" timestamp="2022-03-24T12:26:35" hostname="vostro" time="0.001">
      <properties/>
      <testcase name="requisitos" classname="com.example.myapplication_teste.ExampleUnitTest" time="0.001"/>
      <system-out><![CDATA[]]></system-out>
      <system-err><![CDATA[]]></system-err>
    </testsuite>

```
Este parser foi implementado para trabalhar com **JUnit 4** e **JUnit 5**. 

## Status

🚧 Em construção... 🚧
Prova de conceito não esta em uso

<!-- ## Inputs
- ```pr_author_username``` 
  **Campo obrigatório**
  Nome do usuário responsável pelo pull request, essa informação é advinda do próprio github. -->

## Output 
  - ```result```
  Resultado em base 64 originário do arquivo JSON gerado apartir da execução dos testes em JUnit.


## Como utilizar o parser 
Para utilizar esta action é necessário adicionar ao ***.github/workflows/main.yml*** o seguinte trecho.

```yml 
- name: Run JUnit evaluation kotlin
    id: evaluator
    uses: ./.github/actions/junit-evaluator-action-kotlin
    with:
        pr_author_username: ${{ github.event.inputs.pr_author_username }}

```

## Configurando seu projeto para utilizar o parser 

No arquivo .github/workflows/main.yml
```
runs: 
  using: "composite"
  steps: 
    - name: Fetch JUnit Parser
      uses: actions/checkout@v2
      with:
        repository: betrybe/junit-parser-action
        ref: v1
        token: ${{ inputs.github_pat }}
        path: .github/actions/junit-parser-action

      - name: Run JUnit Parser
        uses: ./.github/actions/junit-parser-action
        with:
          test-path: 'app/build/outputs/androidTest-results/connected/'
```

