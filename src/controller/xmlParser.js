const xml2js = require('xml2js');

/**
 * Transforma xml em object
 * @param {string} xml_string
 * @example loadFileUsingUrl("<?xml version="1.0" encoding="UTF-8"?>
    <testsuite name="com.example.myapplication_teste.ExampleUnitTest" tests="1" skipped="0" failures="0" errors="0" timestamp="2022-03-24T12:26:35" hostname="vostro" time="0.001">
      <properties/>
      <testcase name="addition_isCorrect" classname="com.example.myapplication_teste.ExampleUnitTest" time="0.001"/>
      <system-out><![CDATA[]]></system-out>
      <system-err><![CDATA[]]></system-err>
    </testsuite>")
 * @output {
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
    testcase: [ [Object], [Object], [Object] ],
    'system-out': [ '' ],
    'system-err': [ '' ]
    }
  }
 */
function parserXmlToObject(xml_string) {
  const parser = new xml2js.Parser();
  let output = "";
  if(xml_string === null || xml_string  === undefined || xml_string === "" ) return new Error("Invalid xml for parsing.");
  parser.parseString(xml_string, function(error, result) {
    if(error === null) {
      output = JSON.parse(JSON.stringify(result, null, 4));
    }
    else {
      throw error;
    }
  });
  return output;
}


module.exports = {
  parserXmlToObject
}


