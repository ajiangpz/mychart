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
    let name = ctx.request.body.name || "",
        pass = ctx.request.body.password || "";
    console.log(name, pass);

    if (name == "jiang" && pass == "1111") {
        ctx.response.body = `<h1>欢迎你,${name}<h1>`;
    } else {
        ctx.response.body = "<h1>Login Failed<h1>";
    }
};
module.exports = {
    'GET/form': fn_form,
    'POST/signin': fn_signin
}