#!/usr/bin/env node

const program = require('@monajs/commander')
const init = require('../src/commands/init.js')
const tiny = require('../src/commands/tiny.js')

const cmds = [{
    command: 'init',
    module: init,
    desc: '根据模版创建新项目'
}, {
    command: 'tiny',
    module: tiny,
    aliases: 't',
    desc: '用tiny压缩图片'
}]

program({
    version: require('../package.json').version,
    desc: '欢迎使用 mona-cli',
    cmds
})
