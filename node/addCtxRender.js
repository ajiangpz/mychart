let nunjuck = require('nunjucks')
nunjuck.configure('views', {
    autoescape: true
})

function addRender(path, opt) {
    nunjuck.configure(path, opt)
    return async (ctx, next) => {
        ctx.render = function (view, model) {
            ctx.response.body = nunjuck.render(view, Object.assign({}, ctx.state || {}, model || {}))
            ctx.response.type = 'text/html'
        }
        await next()
    }
}
module.exports = addRender