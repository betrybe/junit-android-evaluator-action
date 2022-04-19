[![Junit-Android-Evaluator](https://img.shields.io/badge/Junit%20Android%20Evaluator-trybe-green.svg)](https://github.com/Naereen/badges)
 [![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)

# JUnit Android Evaluator 

Projeto em javascript responsável por processar saída  resultante da execução de testes em junit e registrar notas no store evaluation.

## Pré-requisitos

Entrada deve ser testes em xml registrados com seguinte estrutura

```xml
  <testsuite name="com.example.myapplication_teste.ExampleUnitTest" tests="1" skipped="0" failures="0" errors="0" timestamp="2022-03-24T12:26:35" hostname="vostro" time="0.001">
    <properties/>
    <testcase name="requisitos" classname="com.example.myapplication_teste.ExampleUnitTest" time="0.001"/>
    <system-out><![CDATA[]]></system-out>
    <system-err><![CDATA[]]></system-err>
  </testsuite>
```
Este projeto foi implementado para trabalhar com **JUnit 4** e **JUnit 5**. 

## Status

🚧 Em construção... 🚧


## Output 
  - ```result```
  Resultado em base 64 originário do arquivo JSON gerado apartir da execução dos testes em JUnit.

## Configurando seu projeto para utilizar o parser 

Para utilizar esta action é necessário adicionar ao ***.github/workflows/main.yml*** o seguinte trecho.
```yml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  Tests:
    runs-on: macos-latest
    steps:
      - name: checkout
        uses: actions/checkout@v3

      - name: Fetch JUnit Parser
        uses: actions/checkout@v3
        with:
          repository: betrybe/junit-parser-action
          ref: v1
          token: ${{ secrets.GIT_HUB_PAT }}
          path: .github/actions/junit-parser-action

      - name: Run JUnit Parser
        uses: ./.github/actions/junit-parser-action
        with:
          pr_author_username: ${{ github.event.pull_request.user.login }}
```


```bash
ncc build index.js --license licenses.txt
```
