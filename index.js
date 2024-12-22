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

function isNullOrEmpty(str) {
  return str == null || str.trim() === '';
}

try {
  const verbose = core.getInput('verbose') === 'true';
  console.log(`verbose is ${verbose} (${verbose === true})`);
  const printContext = core.getInput('printContext') === 'true';
  console.log(`printContext is ${printContext} (${printContext === true})`);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  if (printContext)
    console.log(`The event payload: ${payload}`);

  const toolArgs = ['provision'];
  const keychain = core.getInput('keychain').trim();
  console.log(`keychain is ${keychain}`);
  const keychainPassword = core.getInput('keychain-password').trim();
  console.log(`keychainPassword is ${keychainPassword}`);
  const certificate = core.getInput('certificate').trim();
  console.log(`certificate is ${certificate}`);
  const certificatePassphrase = core.getInput('certificate-passphrase').trim();
  console.log(`certificatePassphrase is ${certificatePassphrase}`);
  const appStoreConnectKeyId = core.getInput('app-store-connect-key-id').trim();
  console.log(`appStoreConnectKeyId is ${appStoreConnectKeyId}`);
  const appStoreConnectIssuerId = core.getInput('app-store-connect-issuer-id').trim();
  console.log(`appStoreConnectIssuerId is ${appStoreConnectIssuerId}`);
  const appStoreConnectPrivateKey = core.getInput('app-store-connect-private-key').trim();
  console.log(`appStoreConnectPrivateKey is ${appStoreConnectPrivateKey}`);
  const installAppStoreConnectPrivateKey = core.getInput('install-app-store-connect-private-key').trim();
  console.log(`installAppStoreConnectPrivateKey is ${installAppStoreConnectPrivateKey}`);
  const appStoreConnectPrivateKeyDirectory = core.getInput('app-store-connect-private-key-directory').trim();
  console.log(`appStoreConnectPrivateKeyDirectory is ${appStoreConnectPrivateKeyDirectory}`);

  if (!isNullOrEmpty(keychain)) {
    toolArgs.push('--keychain');
    toolArgs.push(keychain);
  }
  if (!isNullOrEmpty(keychainPassword)) {
    toolArgs.push('--keychain-password');
    toolArgs.push(keychainPassword);
  }

  if (!isNullOrEmpty(certificate)) {
    toolArgs.push('--certificate');
    toolArgs.push(certificate);
  }

  if (!isNullOrEmpty(certificatePassphrase)) {
    toolArgs.push('--certificate-passphrase');
    toolArgs.push(certificatePassphrase);
  }

  if (!isNullOrEmpty(appStoreConnectKeyId)) {
    toolArgs.push('--api-key-id');
    toolArgs.push(appStoreConnectKeyId);
  }

  if (!isNullOrEmpty(appStoreConnectIssuerId)) {
    toolArgs.push('--api-issuer-id');
    toolArgs.push(appStoreConnectIssuerId);
  }

  if (!isNullOrEmpty(appStoreConnectPrivateKey)) {
    toolArgs.push('--api-private-key');
    toolArgs.push(appStoreConnectPrivateKey);
  }

  if (!isNullOrEmpty(installAppStoreConnectPrivateKey)) {
    toolArgs.push('--install-api-private-key');
  }

  if (!isNullOrEmpty(appStoreConnectPrivateKeyDirectory)) {
    toolArgs.push('--api-private-key-dir');
    toolArgs.push(appStoreConnectPrivateKeyDirectory);
  }

  // .trim();
  const profileTypesI = core.getInput('profile-types').trim();
  console.log(`profileTypes is ${profileTypesI}`);
  if (!isNullOrEmpty(profileTypesI)) {
    const profileTypes = profileTypesI.split(",");
    profileTypes.forEach((profileType) => {
      if (!isNullOrEmpty(profileType)) {
        toolArgs.push('--profile-type');
        toolArgs.push(profileType);
      }
    });
  }

  const bundleIdentifiersI = core.getInput('bundle-identifiers').trim();
  console.log(`bundleIdentifiers is ${bundleIdentifiersI}`);
  if (!isNullOrEmpty(bundleIdentifiersI)) {
    const bundleIdentifiers = bundleIdentifiersI.split(",");
    bundleIdentifiers.forEach((bundleIdentifier) => {
      if (!isNullOrEmpty(bundleIdentifier)) {
        toolArgs.push('--bundle-identifier');
        toolArgs.push(bundleIdentifier);
      }
    });
  }

  if (verbose)
    console.log(`toolArgs: ${toolArgs}`);

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
