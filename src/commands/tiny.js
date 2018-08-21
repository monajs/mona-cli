const { log, renderAscii } = require('../core/util')
const tinify = require('tinify')
const fs = require('fs')
const Spinner = require('../core/spinner')
const { TINY_KEY } = require('../data')

exports.command = 'tiny'

exports.aliases = ['t']

exports.desc = '压缩图片'

exports.builder = {}

function error (message, error) {
  log.error(message)
  renderAscii()
  throw error
}

exports.handler = async argvs => {
  const { _ } = argvs
  if (!_[1]) {
    error('待压缩图片缺失', new Error('待压缩图片缺失'))
  }
  tinify.key = TINY_KEY
  const spinner = new Spinner('正在进行压缩...')
  spinner.start()
  fs.readFile(_[1], (err, source) => {
    if (err) {
      error('读取图片失败', err)
    }
    tinify.fromBuffer(source).toBuffer((err, res) => {
      if (err) {
        error('图片流转换失败', err)
      }
      fs.writeFile(_[1], res, err => {
        if (err) {
          error('图片写入失败', err)
        }
        spinner.stop()
        log.success('图片压缩成功')
      })
    })
  })
}
