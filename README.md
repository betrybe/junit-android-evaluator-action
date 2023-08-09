# 🤖 JUnit Android Evaluator Action [![CI](https://github.com/betrybe/junit-android-evaluator-action/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/betrybe/junit-android-evaluator-action/actions/workflows/main.yml)

Projeto em javascript responsável por processar os relatórios(xml) de testes unitários e instrumentados.


## Inputs

  - `unit_test`: Variável responsável por determinar  a execução dos testes unitários. **`default: true`**
  - `instrumented_test`:  Variável responsável por determinar a execução dos testes instrumentados. **`default: false`**
  - `pr_author_username`: Nome do autor do pull request.

## Output 
  - ```result```
  Resultado em base 64 originário do arquivo JSON gerado a partir da execução dos testes em JUnit.

## Configurando seu projeto para utilizar o avaliador 

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

      - name: Fetch JUnit Android Evaluator
        uses: actions/checkout@v3
        with:
          repository: betrybe/junit-android-evaluator-action
          ref: v1
          token: ${{ secrets.GIT_HUB_PAT }}
          path: .github/actions/junit-android-evaluator-action

      - name: Run JUnit Android Evaluator
        id: evaluator
        uses: ./.github/actions/junit-android-evaluator-action
        with:
          pr_author_username: ${{ github.event.pull_request.user.login }}
```
Para habilitar ou desabilitar a execução de um tipo de teste, basta passar via parâmetro no passo da execução do avaliador.
```yml
  - name: Run JUnit Android Evaluator
    id: evaluator
    uses: ./.github/actions/junit-android-evaluator-action
    with:
      pr_author_username: ${{ github.event.pull_request.user.login }}
      unit_test: false
      instrumented_test: true
```


## Build

Para não ter que rodar o `npm install` na execução da action, usamos o `vercel/ncc` para compilar o projeto em um único arquivo na pasta `dist`.
```bash
ncc build index.js --license licenses.txt
```


## Fluxo de execução

#### 🧜‍♀️ Mermaid

```mermaid
  graph TD
      codigo[Código] -->|junit-android-action executa| nodejs(Setup Nodejs)
      nodejs --> jdk(Setup JDK)
      jdk --> gradle(Gradle Cache)
      gradle --> |Verifica input| unit{inputs.unit_test == true}
      gradle --> |Verifica input| instrumented{inputs.instrumented_test == true}
      unit --> |true| run(Executa Teste)
      instrumented --> |true| run(Executa Teste)
      unit --> |false| norun(Não executa o teste)
      instrumented --> |false| norun(Não executa o teste)
      run --> |Gera Ouput| parser(Executa avaliador)
      parser --> base64(Gera base64)
      base64 --> output(Retorna base64 no output: result)
      output --> END
```
#### 🪄 Whimsical
![Whimsical](doc/diagram.png)
