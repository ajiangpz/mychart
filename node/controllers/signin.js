let fn_form = async (ctx, next) => {
    ctx.response.type = "text/html";
    ctx.response.body = `<form action="/signin" method="post">
        姓名：<input type="text" name="name" placeholder="请输入姓名"><br>
        密码：<input type="password" name="password" placeholder="请输入密码"><br>
        <input type="submit" value="提交">
        <button type="reset" value="重置">重置</button>
    </form>`;
}
let fn_signin = async (ctx, next) => {
    let name = ctx.request.body.username || "",
        pass = ctx.request.body.password || "";
    console.log(name, pass);
    //此处判断用户是否存在在数据库中

    //如果输入的username与cookie中存储的名字不一样，则删除原来的session，这样能将次数与username绑定
    if(ctx.session.username!==name){
        ctx.session.views=0;
    }
    ctx.response.type="text/html"
    console.log(ctx.session.views)
    let n = ctx.session.views || 0;
    //触发session的get(),根据session对象和私钥判断token是否正确，如果不正确获或者session对象不存在则为undefined
    ctx.session.views = ++n;
    ctx.session.username=name;
    //触发session的set(),设置cookies等行为，更新浏览器的koa:sess
    //签名也会随之改变，由于此时session在浏览器可见，因此不应该将用户的重要信息存在session中
    //用户发送请求时，会将session对象和对应的签名token发送给服务器，服务器将session对象利用密钥再次进行签名，将得到的
    //token与发过来的token做比较，如果是一样的，就可以确定session对象没有被改动过。接着在服务器端修改session对象的状态信息，
    //一点修改就会将新的session对象和对应的token通过设置cookie的方式发送给浏览器
    ctx.body = n + ' views';
    // if (name == "jiang" && pass == "1111") {
    //     ctx.response.body = `<h1>欢迎你,${name}<h1>`;
    // } else {
    //     ctx.response.body = "<h1>Login Failed<h1>";
    // }
};
module.exports = {
    'GET/form': fn_form,
    'POST/signin': fn_signin
}