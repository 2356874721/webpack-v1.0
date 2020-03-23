/*
 * @Author: liwenjing
 * @Description: 
 * @Date: 2020-03-23 10:37:52
 * @LastEditors: liwenjing
 * @LastEditTime: 2020-03-23 15:00:19
 * @LastEditDetails: 
 */
const fs = require('fs')
const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default
const path = require('path')
const {transformFromAst} = require('@babel/core')

module.exports = class Webpack{
    constructor({entry,output}){
        this.entry = entry
        this.output = output
        this.run()
    }
    run(){
        const info = this.analyser(this.entry)
        // console.log(info)
        const moduleArr = [info]
        // 递归分析
        for(let i=0;i<moduleArr.length;i++){
            const {dependencies} = moduleArr[i]
            if(dependencies){
                for(let j in dependencies){
                    moduleArr.push(
                        this.analyser(dependencies[j])
                    )
                }
            }
        }
        // console.log(moduleArr)
        //moduleArr格式转换
        const moduleObj = {}
        moduleArr.forEach(({filename,dependencies,code}) => {
            moduleObj[filename] = {
                dependencies,
                code
            }
        })
        //console.log(moduleObj)
        //写到dist出口文件中
        this.file(moduleObj)
    }
    analyser(filename){
        //1 获取到文件中的内容
        const content = fs.readFileSync(filename,'utf-8')
        // console.log(content)

        //2 模块分析，依赖哪些模块以及依赖的路径  @babel/parser 能给我们返回一个抽象语法树ast
        const ast = parse(content,{
            sourceType:'module'
        })
        // console.log(ast.program.body)

        //3 根据ast.program.body的结果 遍历出所有引入的模块,提取出import依赖的模块 @babel/traverse
        const dependencies = {}
        traverse(ast,{
            ImportDeclaration({node}){
                // console.log(node.source.value)//./add.js 取出来的是相对于入口文件的路径，这里我们需要的是src的路径
                const newFileName = './' + path.join(path.dirname(filename),node.source.value)
                dependencies[node.source.value] = newFileName //{ './add.js': './src/add.js', './add1.js': './src/add1.js' }
            }
        })
        
        //4 分析内容 编译内容 @babel/core @babel/preset-env 使用transformFromAst方法进行语法转换
        const {code} = transformFromAst(ast,null,{
            presets:['@babel/preset-env']//通过@babel/preset-env语法规则进行转换
        })
        return{
            filename,
            dependencies,
            code
        }
    }
    file(moduleObj){
        const newModuleObj = JSON.stringify(moduleObj)
        const pathName = path.join(
            this.output.path,
            this.output.filename
        )
        const bundle = 
        `(function(graph){
            function require(module){
                var exports = {}
                function localRequire(path){
                    return require(graph[module].dependencies[path])
                }
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[module].code)
                return exports
            }
            require('${this.entry}')
        })(${newModuleObj})`
        fs.writeFileSync(pathName,bundle,'utf-8')
    }
}