const { log } = require('../core/util')
const Inquire = require('inquirer')
const path = require('path')
const fs = require('fs')
const getGitUser = require('../core/git-user')
const Khaos = require('khaos-patched')
const Spinner = require('../core/spinner')
const download = require('download-git-repo')
const uid = require('uid')
const rm = require('rimraf').sync
const { githubTemplates } = require('../data/init')

exports.command = 'init'

exports.aliases = ['init']

exports.desc = '初始化项目'

exports.builder = {}

const initProject = {
    init (argvs) {
        const { _ } = argvs
        this.projectInfo.fromGit = !argvs.l
        if (!this.projectInfo.fromGit) {
            if (!_[1]) {
                log.error('本地模版地址不能为空！')
                return
            } else {
                this.projectInfo.templatePath = path.join(_[1], 'template')
            }
        }
        this.getInfo()
    },
    
    projectInfo: {
        fromGit: true // 资源来源 - github | local
    },
    
    getInfo () {
        this.projectInfo = Object.assign({}, this.projectInfo, getGitUser())
        let prompts = []
        if (this.projectInfo.fromGit) {
            const choice = Object.keys(githubTemplates)
            prompts.push({
                type: 'list',
                name: 'projectType',
                message: '请选择你要生成的项目',
                choices: choice
            })
        }
        
        prompts.push({
            type: 'input',
            name: 'projectName',
            message: '请输入新建项目的项目名称',
            validate (val) {
                if (val) {
                    return true
                } else {
                    return '项目名称不能为空，请输入项目名称！'
                }
            }
        })
        
        prompts.push({
            type: 'input',
            name: 'projectDesc',
            message: '请输入新建项目的项目描述'
        })
        
        Inquire.prompt(prompts).then(answers => {
            this.projectInfo = Object.assign(this.projectInfo, answers)
            this.ctrl()
        })
    },
    
    ctrl () {
        const { projectType, fromGit, templatePath } = this.projectInfo
        if (fromGit) {
            const tmp = './yangxi-temp-' + uid()
            const spinner = new Spinner('正在下载模版...')
            spinner.start()
            
            download(githubTemplates[projectType], tmp, function (err) {
                spinner.stop()
                if (err) {
                    log.error(err)
                }
                this.generate(tmp)
            }.bind(this))
        } else {
            this.generate(templatePath)
        }
    },
    
    generate (tmp) {
        const { projectName, fromGit } = this.projectInfo
        const khaos = new Khaos(tmp)
        khaos.schema(this.formatOptions())
        khaos.generate(`./${projectName.trim()}`, (err) => {
            fromGit && rm(tmp)
            if (err) {
                log.error(err)
                return
            }
            log.success('创建成功！')
        })
    },
    
    formatOptions () {
        const keys = ['projectName', 'projectDesc', 'author', 'email']
        const options = {}
        
        keys.forEach(v => {
            options[v] = {
                type: 'string',
                default: this.projectInfo[v]
            }
        })
        return options
    }
}

exports.handler = async argvs => {
    initProject.init(argvs)
}
