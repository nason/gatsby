#!/usr/bin/env node

/*eslint-disable */
require('babel-core/register')
require('coffee-script/register')

global.appStartTime = Date.now()

var sysPath = require('path')
var fs = require('fs')
var version = process.version
var versionDigits = version.split('.')
  .map(function (d) { return d.match(/\d+/)[0] })
  .slice(0, 2).join('.')
var verDigit = Number(versionDigits)

if (verDigit < 0.12) {
  console.error(
    'Error: Gatsby 0.9+ requires node.js v0.12 or higher (you have ' + version + ') ' +
    'Upgrade node to the latest stable release.'
  )
  process.exit()
}

var cwd = sysPath.resolve('.')
var cliFile = sysPath.join('dist', 'bin', 'cli.js')
var localPath = sysPath.join(cwd, 'node_modules', 'gatsby', cliFile)

var loadGatsby = function (path) {
  require(path)
}

function checkFolder () {
  const requiredDirs = [
    'pages',
  ].map(dir => sysPath.join(cwd, dir))
  const requiredFiles = [
    'html.js',
    'pages/_template.js',
  ].map(file => sysPath.join(cwd, file))

  const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir))
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))

  if (missingDirs.length) {
    console.error(`Error: Missing required folder(s): ${missingDirs.join(', ')}`)
  }
  if (missingFiles.length) {
    console.error(`Error: Missing required file(s): ${missingFiles.join(', ')}`)
  }
  if (missingDirs.length || missingFiles.length) {
    process.exit(1)
  }
}

var commandsToValidcate = ['build', 'develop', 'serve-build']
if (process.argv[2] && commandsToValidcate.indexOf(process.argv[2]) !== -1) {
  // Verify the project is a valid gatsby project
  checkFolder()
}

fs.access(localPath, function (error) {
  if (error) {
    console.error(
      "A local install of Gatsby was not found.\n" +
      "You should save Gatsby as a site dependency e.g. npm install --save gatsby"
    )
  } else {
    try {
      loadGatsby(localPath)
    } catch(error) {
      console.error(
        'Gatsby: Local install exists but failed to load it.',
        error
      )
    }
  }
})
