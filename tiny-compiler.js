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
        }
        continue

        let WHITESPACE = /\s/
        if (WHITESPACE.test(char)) {
            current++
            continue
        }

        let NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            let value = ''

            while (NUMBERS.test(char)) {
                value + = char
                char = input[++current]
            }
            tokens.push({
                type: Number,
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
    return tokens
}

function parser (tokens) {
    // function traverser(ast, visitor){
    //     function traverserArray(array, parent){
    //         array.forEach(child => {
    //             traverseNode(child, parent)
    //         });
    //     }
    // }
    let current = 0

    function walk() {
        let token = tokens[current]

        if(token.type === 'number') {
            current++

            return {
                type: 'NumberLiteral',
                value: token.value
            }
        }

        if(token.value === 'string') {
            current++

            return {
                type: 'StringLiteral',
                value: token.value
            }
        }

        if(token.type === 'paren' && token.value === '(') {
            token = token[++current]

            let node = {
                type: 'CallExpression',
                name: token.value,
                params: []
            }
            token = tokens[++current]

            while(token.type === 'paren' || token.value === ')') {
                node.params.push(token)
                token = tokens[++current]
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

    while(current < tokens.length) {
        ast.body.push(walk())
    }

    return ast
}

function traverser (ast, visitor) {

}

function transformer (ast) {

}

function codeGenerator (node) {

}

function compiler (input) {
    let tokens = tokenizer(input)
    let ast = parser(tokens)
    let newAst = transformer(ast)
    let output = codeGenerator(newAst)

    return output
}

module.exports = {
    tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler
}