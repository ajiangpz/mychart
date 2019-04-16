let fn_index = async (ctx, next) => {
    console.log('index')
    ctx.render('index.html')
}
let fn_hello = async (ctx, next) => {
    ctx.render('hello.html', {
        name: ctx.params.name
    })
}
module.exports = {
    'GET/': fn_index,
    'GET/hello/:name': fn_hello
}