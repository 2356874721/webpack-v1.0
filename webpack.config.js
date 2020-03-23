/*
 * @Author: liwenjing
 * @Description: 
 * @Date: 2020-03-23 10:35:54
 * @LastEditors: liwenjing
 * @LastEditTime: 2020-03-23 10:37:29
 * @LastEditDetails: 
 */
const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        path:path.relative(__dirname,'dist'),
        filename:'main.js'
    }
}