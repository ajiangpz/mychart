let fs = require('fs')
const multer = require('koa-multer')
const mime = require('mime')
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/'); 
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let fileExtend = mime.getExtension(file.mimetype)
        if (fileExtend === 'xls' || fileExtend === 'xlsx') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

function addMapping(router, o) {
    Object.keys(o).forEach((item) => {
        if (item.startsWith('G')) {
            router.get(item.slice(3), o[item])
        } else if (item.startsWith('P')) {
            if (o[item] instanceof Array) {
                router.post(item.slice(4), ...o[item])
            } else {
                router.post(item.slice(4), o[item])
            }
        } else {
            console.log('invalid url')
        }
    })
}

function addController(router, dir) {
    let files = fs.readdirSync(__dirname + '/controllers')

    let routers = files.filter((item) => {
        return item.endsWith('.js')
    })
    routers.forEach((item) => {
        let o = require(__dirname + dir + item)
        addMapping(router, o)
    })
    return router.routes()
}
module.exports = (dir) => {
    let controller_dir = dir || '/controllers/',
        router = require('koa-router')();
    addController(router, controller_dir);
router.post('/uploadFile', upload.single('file'), async (ctx, next) => {
	console.log(ctx.req.file)
	if (!ctx.req.file) {
		ctx.body = {
			status: false,
			data: 'ecxel,csv'
		}
	} else {
		ctx.body = {
			status: true,
			data: ctx.req.file
		}
	}
})

    return router.routes()
}
//将处理url的函数从app.js提取出来作为一个中间件，中间件必须是一个函数
//当app使用这个中间件时，实际上已经把所有的url处理接口加载完毕，接下来只需要将这些接口激活，即使用router.routes
//打开所有的接口，浏览器才可以访问这些接口
//app.use(path,function(){})
//第一个参数默认是/,第二个参数是请求处理函数，通过use来注册