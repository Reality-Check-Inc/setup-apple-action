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

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  if (verbose)
    console.log(`The event payload: ${payload}`);

    try {
      let describeOutput = '';
      const options = {};
      options.listeners = {
        stdout: (data) => {
          describeOutput += data.toString();
        }
      };
      await exec.exec('xcrun', ['--show-sdk-path', '--sdk', 'macosx'], options);
      const trimmed = describeOutput.trim();
      console.log(`MacOSX SDK path: ${trimmed}`);

    } catch (error) {
      console.log(error.message);
    }

} catch (error) {
  core.setFailed(error.message);
}
