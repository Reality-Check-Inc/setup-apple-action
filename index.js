// index.js

// https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action
/*
npm install @actions/core
npm install @actions/github
npm install @actions/exec
npm install xml2js
npm i -g @vercel/ncc

ncc build index.js --license licenses.txt
git commit -m "action update"
git tag -a -m "action update" v1.2
git push --follow-tags
*/

const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

try {
  const verbose = core.getInput('verbose') === 'true';
  console.log(`verbose is ${verbose} (${verbose === true})`);
  const printContext = core.getInput('printContext') === 'true';
  console.log(`printContext is ${printContext} (${printContext === true})`);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  if (printContext)
    console.log(`The event payload: ${payload}`);

  const ciArray = ['provision'];
  //ciArray.push(4);
  if (verbose)
    console.log(`Option Array: ${ciArray}`);

  /*
  async function installTools() {
    try {
      let installOutput = '';
      const installOptions = {};
      installOptions.listeners = {
        stdout: (data) => {
          installOutput += data.toString();
        }
      };
      // https://www.nuget.org/packages/AppleDev.Tools
      const AppleDevToolsVersion = '0.6.2';
      await exec.exec('dotnet', ['tool', 'install', '--global', 'AppleDev.Tools', '--version', AppleDevToolsVersion], installOptions);
      const installTrimmed = installOutput.trim();
      if (verbose)
        console.log(installTrimmed);

      async function ciProvision() {
        try {
          let ciOutput = '';
          const ciOptions = {};
          ciOptions.listeners = {
            stdout: (data) => {
              ciOutput += data.toString();
            }
          };
          await exec.exec('ci', ciArray, ciOptions);
          const ciTrimmed = ciOutput.trim();
          console.log(`ci output: ${ciTrimmed}`);
        } catch (error) {
          console.log(error.message);
        }
      }
      ciProvision();

    } catch (error) {
      console.log(error.message);
    }
  }
  installTools();
  */

} catch (error) {
  core.setFailed(error.message);
}
