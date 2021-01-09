function tokenizer (input) {

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