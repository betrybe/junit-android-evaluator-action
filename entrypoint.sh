#!/bin/bash
set -x

red='\033[0;31m'
green='\033[32m'
blue='\033[36m'
reset='\033[0m'

if [[ ! -z "${INPUT_COVERAGE_DATA}" ]]; then
  echo "${INPUT_COVERAGE_DATA}" | base64 --decode > /app/coverage.json
fi

if .gradle build -x teste; then
  .gradle clean
  .gradle build 
  STATUS=0
else 
  exit 1
fi
TEST_PATH="build/test-results/test"

echo -e "${blue}[info] Running tests${reset}"
echo $(node com.betrybe.junitevaluatorkotlin.index.js)
echo ::set-output name=result::`cat result.json | base64 -w 0`
echo -e "${green}[info] Tests finished${reset}"
exit 0