let componentInfo = require('./src/component-list')
let rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require("rollup-plugin-node-resolve");
let path = require('path')
let fs = require('fs')
const minify = require('uglify-es').minify
const uglify = require('rollup-plugin-uglify').uglify
const {
    pkgTypeList,
    addons
} = require("./config");
let pkg = [];
pkgTypeList.forEach(({
    type,
    min,
    suffix
}) => {
    Object.keys(componentInfo).forEach(function (name) {
        const {
            src,
            dist
        } = componentInfo[name]
        pkg.push({
            min,
            type,
            suffix,
            globalName: name,
            src,
            dist
        })
    })
})
pkg = pkg.concat(addons);
pkg.forEach(function (item) {
    rollupFn(item)
})

fs.mkdirSync(path.resolve(__dirname, './lib'))
async function rollupFn(item) {
    const {
        min,
        dist,
        suffix,
        src: input,
        type: format,
        globalName: name
    } = item
    console.log(input)
    let distPath = dist + suffix;
    console.log(distPath)
    const isCommonjs = format === 'cjs'
    let reg = isCommonjs ?
        /(^(echarts|numerify|utils-lite)|(\/core|\/utils|\/constants)$)/ :
        /^(echarts)/
    const external = id => reg.test(id)
    const globals = {
        'echarts/lib/echarts': 'echarts'
    }
    const plugins = [
        resolve(),
        babel()
    ]
    if (min) plugins.push(uglify({}, minify))
    const bundle = await rollup.rollup({
        input,
        external,
        plugins
    })

    await bundle.write({
        file: distPath,
        format,
        name,
        globals
    })

}