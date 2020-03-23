(function(graph){
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
            require('./src/index.js')
        })({"./src/index.js":{"dependencies":{"./add.js":"./src/add.js","./add1.js":"./src/add1.js"},"code":"\"use strict\";\n\nvar _add = require(\"./add.js\");\n\nvar _add2 = require(\"./add1.js\");\n\nconsole.log((0, _add.add)(3, 5));\nconsole.log((0, _add2.add1)(3, 5));"},"./src/add.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add = void 0;\n\n/*\n * @Author: liwenjing\n * @Description: \n * @Date: 2020-03-23 10:29:54\n * @LastEditors: liwenjing\n * @LastEditTime: 2020-03-23 10:34:54\n * @LastEditDetails: \n */\nvar add = function add(x, y) {\n  return x + y;\n};\n\nexports.add = add;"},"./src/add1.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add1 = void 0;\n\n/*\n * @Author: liwenjing\n * @Description: \n * @Date: 2020-03-23 12:38:50\n * @LastEditors: liwenjing\n * @LastEditTime: 2020-03-23 14:59:57\n * @LastEditDetails: \n */\nvar add1 = function add1(x, y) {\n  return x + y;\n};\n\nexports.add1 = add1;"}})