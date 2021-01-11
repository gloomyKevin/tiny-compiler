function tokenizer (input) {
    let current = 0

    let tokens = []

    while(current < input.length) {
        let char = input[current]

        if(char === '('){
            tokens.push({
                type: 'paren',
                value: '('
            })
            current++
        continue
        }
        
        if(char===')'){
            tokens.push({
                type: 'paren',
                value: ')'
            })
        }
        continue

        let WHITESPACE = /\s/
        if(WHITESPACE.test(char)){
            current++
            continue
        }

        let NUMBERS = /[0-9]/
        if(NUMBERS.test(char)){
            let value = ''

            while(NUMBERS.test(char)){
                value+ = char
                char = input[++current]
            }
            tokens.push({
                type: Number,
                value
            })
            continue
        }
        throw new TypeError('I dont know what this character is' + char)
    }
    return tokens
}

function parser(tokens){

}

function traverser(ast, visitor){

}

function transformer(ast){

}

function codeGenerator(node){

}

function compiler(input){
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