/**
 * expo-heroku.js - A small script to run expo dev server on heroku with enhancement
 * 
 * Written by BattlefieldDuck 
 * 9:53pm, Thursday, 10 December 2020.
 * 
 * Environment variables used
 *  PORT - Heroku web port, heroku will auto generate, no need to set manually
 *  HEROKU_APP_NAME - Heroku app name, example: https://abcde.herokuapp.com/, then HEROKU_APP_NAME=abcde
 *  EXPO_PROJECT_NAME - Expo project name, it should be the same as your expo project folder name
 *  EXPO_START_ARGS - The args that pass to `expo start` command (optional)
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const execSync = require('child_process').execSync

const npmRoot = execSync('npm -g root').toString().trimEnd()
const devToolsServer = path.join(npmRoot, 'expo-cli', 'node_modules', '@expo', 'dev-tools', 'build', 'server', 'DevToolsServer.js')

// Edit DevToolsServer.js directly
if (fs.existsSync(devToolsServer)) {
  let data = fs.readFileSync(devToolsServer, { encoding: 'utf8', flag: 'r' })

  // Replace the dev port from 19002 to heroku port - Line 62
  data = data.replace('19002', process.env.PORT)

  // hostname - Replace herokuapp.com with app name - Line 47
  data = data.replace('${devtoolsGraphQLHost()}:${port}', `${process.env.HEROKU_APP_NAME}.herokuapp.com`)

  // webSocketGraphQLUrl - Replace ws to wss - Line 48
  data = data.replace('ws://', 'wss://')

  // allowedOrigin - Replace http to https - Line 49
  data = data.replace('http://${hostname}', 'https://${hostname}')

  fs.writeFileSync(devToolsServer, data, { encoding: 'utf8' })
}

// Disable watch - fs.inotify.max_user_watches=8192 in heroku which is not enough, also expo don't have a way to disable that, so edit directly
const graph = path.join(__dirname, process.env.EXPO_PROJECT_NAME, 'node_modules', 'metro', 'src', 'node-haste', 'DependencyGraph.js')
if (fs.existsSync(graph)) {
  let data = fs.readFileSync(graph, { encoding: 'utf8', flag: 'r' })
  fs.writeFileSync(graph, data.replace('watch: ', 'watch: false//'), { encoding: 'utf8' })
}

// Edit UI
let indexJS = path.join(npmRoot, 'expo-cli', 'node_modules', '@expo', 'dev-tools', 'build', 'client', '_next', 'static')
fs.readdirSync(indexJS).forEach(hash => { if (hash !== 'chunks' && hash !== 'runtime') indexJS = path.join(indexJS, hash, 'pages', 'index.js') } )
if (fs.existsSync(indexJS)) {
  let data = fs.readFileSync(indexJS, { encoding: 'utf8', flag: 'r' })

  // Add 'Run on Expo Client' button on sidemenu and remove others buttons
  if (data.includes('Run on Android device\/emulator') && !data.includes('Run on Expo Client')) {
    const elementRegex = /,[a-zA-Z]{1,}.createElement\(\"div\",{className:[a-zA-Z]{1,},onClick:(.{1,})},[a-zA-Z]{1,}.createElement\(\"span\",{className:[a-zA-Z]{1,}},\"(Run on Android device\/emulator)\"\)\)/
    const matches = data.match(elementRegex)
    let element = matches[0], onClick = matches[1], textBox = matches[2]
    let newElement = element.replace(onClick, 'function(){window.open(url,"_blank")}').replace(textBox, 'Run on Expo Client')
    data = data.replace(/,[a-zA-Z]{0,3}.createElement\("div",{className:.{0,3},onClick:this.props.onSimulatorClickAndroid}.{0,}\"Publish or republish project.\"\).{0,}}\)\)\):null/, newElement).replace('=!this.props.url,', '=!this.props.url,url=this.props.url,')
    fs.writeFileSync(indexJS, data, { encoding: 'utf8' })
  }
}

// Self ping every 5 minutes to prevent idle
setInterval(() => https.get(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com/?t=${+new Date()}`), 5 * 60 * 1000)

// Start expo
execSync(`expo start ${process.env.EXPO_PROJECT_NAME}` + (process.env.EXPO_START_ARGS ? ` ${process.env.EXPO_START_ARGS}` : ''), { stdio: 'inherit' })
