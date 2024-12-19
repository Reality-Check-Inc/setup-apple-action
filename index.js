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
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
