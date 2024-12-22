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

function base64ToFile(base64String, filePath) {
  const buffer = Buffer.from(base64String, 'base64');
  fs.writeFileSync(filePath, buffer);
}

function readDirectoryRecursive(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }
        if (stats.isDirectory()) {
          readDirectoryRecursive(filePath); // Recursively read subdirectory
        } else {
          console.log(filePath); // Process file
        }
      });
    });
  });
}

function isNullOrEmpty(str) {
  return str == null || str.trim() === '';
}

try {
  const verbose = core.getInput('verbose') === 'true';
  console.log(`verbose is ${verbose} (${verbose === true})`);
  const printContext = core.getInput('printContext') === 'true';
  console.log(`printContext is ${printContext} (${printContext === true})`);
  const AppleDevToolsVersion = core.getInput('version');
  console.log(`AppleDev.Tools version request is ${AppleDevToolsVersion}`);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  if (printContext)
    console.log(`The event payload: ${payload}`);
  const processDirectory = process.cwd();
  if (verbose)
    console.log("process directory: ", processDirectory);

  const toolArgs = ['ci', 'provision'];
  const keychain = core.getInput('keychain').trim();
  const keychainPassword = core.getInput('keychain-password').trim();
  const certificate = core.getInput('certificate').trim();
  const certificatePassphrase = core.getInput('certificate-passphrase').trim();
  const appStoreConnectKeyId = core.getInput('app-store-connect-key-id').trim();
  const appStoreConnectIssuerId = core.getInput('app-store-connect-issuer-id').trim();
  const appStoreConnectPrivateKey = core.getInput('app-store-connect-private-key').trim();
  const installAppStoreConnectPrivateKey = core.getInput('install-app-store-connect-private-key').trim();
  const appStoreConnectPrivateKeyDirectory = core.getInput('app-store-connect-private-key-directory').trim();

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
    if (certificate.endsWith("="))
    {
      const outputFile = 'certificate.asc';
      var outputPath = path.join(processDirectory, outputFile);
      base64ToFile(certificate, outputPath);
      toolArgs.push(outputPath);
    }
    else
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
    if (appStoreConnectPrivateKey.endsWith("="))
    {
      const outputFile = 'appStoreConnectPrivateKey.asc';
      var outputPath = path.join(processDirectory, outputFile);
      base64ToFile(appStoreConnectPrivateKey, outputPath);
      toolArgs.push(outputPath);
    }
    else
      toolArgs.push(appStoreConnectPrivateKey);
  }

  if (!isNullOrEmpty(installAppStoreConnectPrivateKey)) {
    toolArgs.push('--install-api-private-key');
  }

  if (!isNullOrEmpty(appStoreConnectPrivateKeyDirectory)) {
    toolArgs.push('--api-private-key-dir');
    toolArgs.push(appStoreConnectPrivateKeyDirectory);
  }

  const profileTypesI = core.getInput('profile-types').trim();
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
      await exec.exec('dotnet', ['tool', 'install', '--global', 'AppleDev.Tools', '--version', AppleDevToolsVersion], installOptions);
      // all this was already shown in the exec
      //const installTrimmed = installOutput.trim();
      //if (verbose)
      //  console.log(installTrimmed);

      //readDirectoryRecursive(processDirectory);
      //var ciPath = path.join(processDirectory, "ci");
      //console.log(`ci is ${ciPath}`);

      async function ciProvision() {
        try {
          let ciOutput = '';
          const ciOptions = {};
          ciOptions.listeners = {
            stdout: (data) => {
              ciOutput += data.toString();
            }
          };
          await exec.exec("apple", toolArgs, ciOptions);
          // all this was already shown in the exec
          //const ciTrimmed = ciOutput.trim();
          //if (verbose)
          //  console.log(`apple output: ${ciTrimmed}`);
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

} catch (error) {
  core.setFailed(error.message);
}
