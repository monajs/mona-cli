const yargs = require('yargs')

module.exports = (options) => {
  options = Object.assign({}, options)
  yargs
    .config(options).option('config', {
    alias: 'c',
    describe: 'The configuration file path'
  })
    .command('$0', '欢迎使用mona-cli.', yargs => {
      yargs.commandDir('./commands')
    }, () => {
      yargs.showHelp()
    }).argv
}
