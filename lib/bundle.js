// 读取基础配置 webpack.config.js
const options = require('../webpack.config.js')
const Webpack = require('./webpack.js')

new Webpack(options)