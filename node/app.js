const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const controll = require('./controll.js')
const addRender = require('./addCtxRender.js')
const static = require('koa-static')
const cors = require('koa2-cors')
const session = require('koa-session');
app.keys=['suijizifuchuan']
const CONFIG = {
key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
/** (number || 'session') maxAge in ms (default is 1 days) */
/** 'session' will result in a cookie that expires when session/browser is closed */
/** Warning: If a session cookie is stolen, this cookie will never expire */
maxAge: 86400000,
autoCommit: true, /** (boolean) automatically commit headers (default true) */
overwrite: true, /** (boolean) can overwrite or not (default true) */
httpOnly: true, /** (boolean) httpOnly or not (default true) */
signed: true, /** (boolean) signed or not (default true) */
rolling: false, 
/** (boolean) Force a session identifier cookie to be set 
 * on every response. The expiration is reset to the original maxAge,
 *  resetting the expiration countdown. (default is false) */
renew: false,
 /** (boolean) renew session when session is nearly expired, 
so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
app.use(cors({credentials:true}))
app.use(static(__dirname))
app.use(addRender('view', {
    noCache: true
})) //给ctx增加render方法s
app.use(bodyParser());
app.use(controll())
app.listen(3000);
console.log("app start at port 3000");