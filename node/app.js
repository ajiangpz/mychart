const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const controll = require('./controll.js')
const addRender = require('./addCtxRender.js')
const static = require('koa-static')
const cors = require('koa2-cors')
app.use(cors())
app.use(static(__dirname))
app.use(addRender('view', {
    noCache: true
})) //给ctx增加render方法s
app.use(bodyParser());
app.use(controll())
app.listen(3000);
console.log("app start at port 3000");