#!/usr/bin/env node

/*eslint-disable */
require('babel-core/register')
require('coffee-script/register')

global.appStartTime = Date.now()

var sysPath = require('path')
var fs = require('fs')
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
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

/*
  These commands can:
  - Use a global install as a fallback if no local install is present
  - Bypass the required file check
 */
const commandsToIgnore = [undefined, 'new', '--help', '-h', '--version', '-V']
const isGlobal = commandsToIgnore.includes(process.argv[2])

const requiredFiles = [
  'html.js',
  'pages/_template.js'
].map(function(file) {
  // Relative to cwd
  return sysPath.join(cwd, file)
})

fs.access(localPath, function (error) {
  if (error) {
    if (!isGlobal) {
      console.error(
        "A local install of Gatsby was not found.\n" +
        "You should save Gatsby as a site dependency e.g. npm install --save gatsby\n"
      )
      process.exit()
    } else {
      console.warn('Proceeding with global Gatsby package.\n');
      fs.realpath(__dirname, function (err, real) {
        if (err) throw err
        loadGatsby(sysPath.join(real, '..', cliFile))
      })
    }
  } else {
    if (!isGlobal && !checkRequiredFiles(requiredFiles)) {
      process.exit()
    }

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
