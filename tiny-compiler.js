function tokenizer (input) {
    let current = 0

    let tokens = []

    while (current < input.length) {
        let char = input[current]

        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            })
            current++
            continue
        }

        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')'
            })
            current++
            continue
        }


        let WHITESPACE = /\s/
        if (WHITESPACE.test(char)) {
            current++
            continue
        }

        let NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            let value = ''

            while (NUMBERS.test(char)) {
                value += char
                char = input[++current]
            }
            tokens.push({
                type: 'number',
                value
            })
            continue
        }

        if (char === '"') {
            let value = ''
            char = input[++current]

            while (char !== '"') {
                value += char
                char = input[++current]
            }

            tokens.push({
                type: 'string',
                value
            })
            continue
        }

        let LETTERS = /[a-z]/i
        if (LETTERS.test(char)) {
            let value = ''
            while (LETTERS.test(char)) {
                value += char
                char = input[++current]
            }
            tokens.push({
                type: 'name',
                value
            })
            continue
        }

        throw new TypeError('I don’t know what this character is' + char)
    }
    console.log(tokens);
    return tokens
}

function parser (tokens) {

    let current = 0

    function walk () {
        let token = tokens[current]

        if (token.type === 'number') {
            current++

            return {
                type: 'NumberLiteral',
                value: token.value
            }
        }

        if (token.type === 'string') {
            current++

            return {
                type: 'StringLiteral',
                value: token.value
            }
        }

        if (token.type === 'paren' && token.value === '(') {
            // console.log(token.value)
            token = tokens[++current]

            let node = {
                type: 'CallExpression',
                name: token.value,
                params: []
            }
            token = tokens[++current]

            while (
                (token.type !== 'paren') || 
                (token.type === 'paren' && token.value !== ')')
            ) {
                node.params.push(walk())
                token = tokens[current]
            }

            current++
            return node
        }

        throw new TypeError(token.type)
    }

    // 构建AST
    let ast = {
        type: 'Program',
        body: []
    }

    while (current < tokens.length) {
        ast.body.push(walk())
    }

    return ast
}

function traverser (ast, visitor) {
    function traverseArray (array, parent) {
        // 遍历AST节点
        Array.forEach(child => {
            traverseNode(child, parent)
        })
    }

    function traverseNode (node, parent) {
        let methods = visitor[node.type]
        if (methods && methods.enter) {
            methods.enter(node, parent)
        }

        switch (node.type) {
            case 'Program':
                traverseArray(node.body, node)
                break;

            case 'CallExpression':
                traverseArray(node.params, node)
                break;
            case 'NumberLiteral':
            case 'StringLiteral':
                break;

            default:
                throw new TypeError(node.type)
        }

        if (methods && methods.exit) {
            methods.exit(node, parent)
        }
    }
    traverseNode(ast, null)
}

function transformer (ast) {
    let newAst = {
        type: 'program',
        body: []
    }

    ast._context = newAst.body

    traverser(ast, {
        NumberLiteral: {
            enter (node, parent) {
                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value
                })
            }
        },
        StringLiteral: {
            enter (node, parent) {
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value
                })
            }
        },
        CallExpression: {
            enter (node, parent) {
                // 创建新的CallExpression节点，其包含一个嵌套的Identifier节点
                let expression = {
                    type: 'callExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name
                    },
                    arguments: []
                }
                // 在原来的CallExpression节点创建一个新的context来引用expression的arguments
                // 这样就能向arguments里添加参数
                node._context = expression.arguments
                if (parent.type !== 'CallExpression') {
                    // 用ExpressionStatement节点包裹CallExpression
                    // 原因是，在JavaScript中，顶层CallExpression是加上是声明
                    expression = {
                        type: 'expressionStatement',
                        expression: expression
                    }
                }
                // 把（可能被包裹的）callExpression添加到parent的context
                parent._context.push(expression)
            }
        }
    })

    return newAst
}

// 递归遍历新AST，输出代码字符串
function codeGenerator (node) {
    switch (node.type) {
        case 'Program':
            return node.body.map(codeGenerator).join('\n')
    }
}

function compiler (input) {
    let tokens = tokenizer(input)
    let ast = parser(tokens)
    // let newAst = transformer(ast)
    // let output = codeGenerator(newAst)

    return ast
}

// test
const input = '(add 2 (subtract 4 2))';
let ast = compiler(input);
console.log(ast);

module.exports = {
    tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler
}