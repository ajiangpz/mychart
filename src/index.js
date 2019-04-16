import "echarts/lib/component/visualMap";
import "echarts/lib/component/legendScroll"
import "echarts/lib/component/toolbox"
import {
    debounce
} from "utils-lite";
import {
    allCharts
} from './components/chart/index'
import "echarts/lib/chart/bar"
import "echarts/lib/chart/pie"
import "echarts/lib/chart/line"
import "echarts-wordcloud/dist/echarts-wordcloud.min.js"

import customSelect from './vueComponents/customSelect.vue'
import customInput from './vueComponents/customInput.vue'
import customCheck from './vueComponents/customCheck.vue'
import customTitle from './vueComponents/customTitle.vue'
import customColor from './vueComponents/customColor.vue'
import customHeader from './vueComponents/customHeader.vue'
import customDialog from './vueComponents/customDialog.vue'
import customRange from './vueComponents/customRange.vue'
import customSettings from './vueComponents/customSettings.vue'
import customDrag from './vueComponents/customDrag.vue'
import barSettings from './vueComponents/barSettings.vue'
import pieSettings from './vueComponents/pieSettings.vue'
import customWidth from './vueComponents/customScrollWidth.vue'
import customChoose from './vueComponents/customChoose.vue'
import customDrop from './vueComponents/customDrop.vue'
// let $dragNode = $("#dragger"),
//     bodyWidth = $("body").width(),
//     dragger = false,
//     timer = null;
// $dragNode.mousedown(function (e) {
//     dragger = true;
// });
// $(document).mousemove(function (e) {
//     let clientX =
//         e.clientX >= 400 ?
//         bodyWidth - e.clientX <= 400 ?
//         bodyWidth - 400 :
//         e.clientX :
//         400;
//     if (dragger) {
//         $dragNode.css("left", clientX + "px");
//         $dragNode.prev().width(clientX + "px");
//         $dragNode.next().css("left", clientX + 10 + "px");
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             line.echarts.resize();
//         }, 1000);
//     }
// });
// $(document).mouseup(function (e) {
//     dragger = false;
//     e.stopPropagation();
// });
// let line = new eLine({
//     el: "chart",
//     data: {
//         columns,
//         rows
//     }
// });
// line.draw();
let app = new Vue({
    el: '#container',
    data() {
        return {
            columns: [],
            rows: [],
            settings: {
                type: 'histogram',
                stack: {
                    stack: []
                },
                axisSite: {
                    right: [],
                    top: []
                },
                limitShowNum: 5,
                yAxisType: ['normal', 'normal'],
                area: false,
                radius: 150,
                offsetY: 300,
                metrics: []
            },
            dataType: ['normal', 'KMB', 'percent'],
            width: '100%',
            height: '100%',
            chartLib: [{
                    name: 'pie',
                    imgSrc: './static/svg/pie.svg',
                    isChoose: {
                        choose: true
                    }
                }, {
                    name: 'histogram',
                    imgSrc: './static/svg/bar.svg',
                    isChoose: {
                        choose: false
                    }
                }, {
                    name: 'line',
                    imgSrc: './static/svg/line.svg',
                    isChoose: {
                        choose: false
                    }
                }, {
                    name: 'map',
                    imgSrc: './static/svg/map.svg',
                    isChoose: {
                        choose: false
                    },

                }, {
                    name: 'bar',
                    imgSrc: './static/svg/bar-x.svg',
                    isChoose: {
                        choose: false
                    },

                },
                {
                    name: 'wordcloud',
                    imgSrc: './static/svg/wordcloud.svg',
                    isChoose: {
                        choose: false
                    }
                }
            ],
            roseType: ['radius', 'area'],
            baseSettingsModel: {
                title: {
                    name: '图表标题',
                    status: true
                },
                axis: {
                    name: '坐标轴',
                    status: false
                },
                outlook: {
                    name: '图表外观',
                    status: false
                },
                series: {
                    name: '数据指标',
                    status: false
                },
                legend: {
                    name: '图例',
                    status: false
                }

            },
            mapPosition: ['china', 'china-cities', 'china-contour', 'world', 'province/beijing'],
            baseSettings: {
                grid: {

                },

                colors: [],
                dataZoom: [{
                    type: 'slider',
                    show: false,
                    id: 'x-zoom',
                    backgroundColor: '#fff'
                }, {
                    type: 'slider',
                    show: false,
                    yAxisIndex: 0,
                    id: "y-zoom",
                    backgroundColor: '#fff'
                }],
                toolbox: {
                    show: false,
                    feature: {
                        saveAsImage: {
                            type: 'png',
                            title: '保存'
                        }
                    }
                },
                title: {
                    show: true,
                    text: "",
                    textStyle: {
                        color: '#333333',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serif',
                        fontSize: 18
                    },
                    left: 'left',
                    top: 'top',
                    subtext: '',
                    subtextStyle: {
                        color: '#333333',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serif',
                        fontSize: 18,
                    }

                },
                legend: {
                    type: 'plain',
                    show: true,
                    left: 'center',
                    top: 'top',
                    width: 'auto',
                    height: 'auto'
                },
                xAxis: [{
                    show: true,
                    name: '',
                    nameTextStyle: {
                        fontSize: 18,
                        fontWeight: 'normal'
                    },
                    nameLocation: 'middle',
                    inverse: false,
                    position: 'bottom'
                }],
                yAxis: [{
                    show: true,
                    name: '',
                    nameTextStyle: {
                        fontSize: 18,
                        fontWeight: 'normal'
                    },
                    position: 'left',
                    nameLocation: 'middle',
                    inverse: false
                }],
                radar: {},
                tooltip: {},
                axisPointer: {},
                brush: [],
                geo: {},
                timeline: [],
                graphic: [],
                textStyle: {
                    fontFamily: 'sans-serif'
                },
                animation: {}
            },
            textColor: {
                value: '#333',
                show: false
            },
            subtextColor: {
                value: '#333',
                show: false
            },
            stepTitle: [{
                name: '导入数据',
                status: true
            }, {
                name: '表格展示',
                status: false
            }, {
                name: '选择模板',
                status: false
            }, {
                name: '定义参数',
                status: false
            }],
            fontSizes: ['8', '10', '11', '12', '14', '16', '18', '20', '22', '25', '26', '28', '30', '32', '34'],
            fontWeights: ['bold', 'bolder', 'lighter', 'normal'],
            align: ['left', 'center', 'right'],
            fontFamilys: ['serif', 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei'],
            verticalAlign: ['top', 'middle', 'bottom'],
            xNameAlign: ['start', 'center', 'end'],
            xAlign: ['top', 'bottom'],
            selectType: {
                bold: 'bold',
                size: 'size',
                align: 'align',
                vertical: 'vertical',
                fontFamily: 'fontFamily'
            },
            columnOptionsShow: false,
            yAlign: ['left', 'right'],
            columnOptions: [{
                name: '升序',
                handler: 'upsort'
            }, {
                name: '降序',
                handler: 'downsort'
            }, {
                name: '删除',
                handler: 'deleteCols'
            }]
        }

    },
    components: {
        customSelect,
        customInput,
        customCheck,
        customTitle,
        customColor,
        customHeader,
        customDialog,
        customRange,
        customSettings,
        customDrag,
        barSettings,
        pieSettings,
        customWidth,
        customChoose,
        customDrop
    },
    computed: {
        menuActive() {
            let a = []
            Object.keys(this.baseSettingsModel).forEach(
                function (value, index) {
                    if (!index) {
                        a.push(true)
                    } else {
                        a.push(false)
                    }
                }
            )
            console.log(a)
            return a;
        },
        charts() {
            let a = [];
            this.chartLib.forEach((item, index) => {
                a.push(item.name)
            })
            return a;
        }
    },

    watch: {
        settings: {
            handler: debounce(function (val) {
                console.log('newSetting', val)
                this.chart.setType(val.type)
                this.chart.dataHandler({
                    settings: val
                });
            }, 1000),
            deep: true
        },
        baseSettings: {
            handler: debounce(function (val) {

                console.log('baseSettings', val)
                this.chart.dataHandler({
                    baseSettings: val
                });
            }, 1000),
            deep: true
        },
        width: {
            handler: debounce(function (val) {
                console.log(val)
                this.chart.resize()

            }, 1000)
        },
        height: {
            handler: debounce(function (val) {
                console.log(val)
                this.chart.resize()

            }, 1000)

        }
        //节流函数，多次操作只执行最后一次操作(这次操作1000ms之前没有任何操作)
        //思路：利用函数嵌套形成闭包，使定时器变量保存在内存中，每一次触发事件处理函数，先
        //清除之前的定时器，再重新开始一个定时器，定时器到了规定时间会自动执行事件处理函数
        //防抖函数，多次操作只执行第一次操作，这次操作1000ms有操作了再执行
        //思路：利用闭包，保留现在的时间，当函数被触发时，保存此时的时间，减去之前保留的时间，是否
        //大于延时时间，如果大于，执行函数，反之，不做任何处理，等待下一次触发
    },
    mounted() {
        let app = this
        Dropzone.options.dropArea = {
            init: function () {
                let _this = this
                this.on('sending', function (file, xhr, formData) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            let responseData = JSON.parse(xhr.responseText)
                            if (!responseData.status) {
                                _this.removeFile(file)
                            }
                        }
                    }
                })
                this.on('success', function (file, res) {

                        let data = null;
                        if (res.data.filename.split('.').reverse()[0] === 'csv') {
                            Papa.parse(file, {
                                complete: function (results) {
                                    app.rows = results.data
                                    app.columns = Object.keys(app.rows[0])
                                    app.init();


                                },
                                header: true
                            });
                        } else {
                            app.readWorkbookFromLocalFile(file, function (workbook) {
                                var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                data = XLSX.utils.sheet_to_json(worksheet)
                                app.rows = data
                                app.columns = Object.keys(app.rows[0])
                                app.init();


                            })
                        }



                    }),
                    this.on('maxfilesexceeded', function (file) {
                        console.log('rearch')
                        _this.removeFile(file)
                    })
            },
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 1, // MB
            accept: function (file, done) {
                let extendName = file.name.split('.').reverse()[0]
                if (extendName === 'xlsx' || extendName === 'xls' || extendName === 'csv') {
                    done();
                } else {
                    done("文件格式错误");
                }
            },
            previewTemplate: document.querySelector('#preview-template').innerHTML,
            addRemoveLinks: true,
            maxFiles: 1,
            acceptedFiles: '.xls,.xlsx,.csv'

        };
    },
    methods: {
        init() {
            this.settings.metrics = this.columns.slice(1, 2)
            this.chart = new allCharts({
                el: 'chart',
                data: {
                    columns: this.columns,
                    rows: this.rows,
                },
                settings: this.settings,

                width: this.width,
                height: this.height
            })
            this.chart.setType('histogram')
            this.chart.draw();
            this.$watch('columns', debounce(function (val) {

                if (this.columns && JSON.stringify(Object.keys(this.rows[0])) === JSON.stringify(this.columns)) {
                    console.log('columns true')
                    this.chart.dataHandler({
                        data: {
                            columns: val,
                            rows: this.rows
                        }
                    })
                } else {
                    console.log('columns false')
                }

            }, 1000));
            this.$watch("rows", debounce(function (val) {

                if (this.rows[0] && (JSON.stringify(Object.keys(this.rows[0])) === JSON.stringify(this.columns))) {
                    console.log('rows true')
                    this.chart.dataHandler({
                        data: {
                            rows: val,
                            columns: this.columns
                        }
                    });
                } else {
                    console.log('rows false')
                }
            }, 1000), {
                deep: true
            })
        },
        readWorkbookFromLocalFile(file, callback) {
            let app = this
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var type = 'binary'
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                if (callback) callback(workbook);
            };
            reader.readAsBinaryString(file);
        },
        deleteRows(index) {
            this.rows.splice(index, 1)
        },
        showItem(step) {
            console.log(step)
            if (step.status) {
                return
            } else {
                step.status = true
                this.stepTitle.forEach(item => {
                    if (item.name !== step.name) {
                        item.status = false
                    }
                })
            }
        },
        setChartModel(chart) {
            let name = chart.name
            let length = this.columns.length
            if (chart.isChoose.choose) {
                return
            } else {
                if (this.settings.metrics) {
                    length = this.settings.metrics.length;
                }
                if (length > 2 && (name === 'pie' || name === 'wordcloud' || name === 'map')) {
                    alert('此类图表指标只能选择一个，请将指标调整至一个')
                    return
                }
                this.chartLib.forEach(item => {
                    if (item.name !== chart.name) {
                        item.isChoose.choose = false
                    }
                })
                this.settings.type = chart.name;
                chart.isChoose.choose = true;
            }

        },
        setClick(value) {
            if (value.status) {
                return
            }

            Object.keys(this.baseSettingsModel).forEach(key => {
                this.baseSettingsModel[key].status = false
            })
            value.status = true
        },
        deleteCols(name) {
            console.log(name)
            this.rows.forEach((item, index) => {
                delete item[name]
            })
            this.columns.splice(this.columns.indexOf(name), 1)
            console.log(this.rows)
        },

        upsort(name) {
            this.rows.sort(function (a, b) {
                return a[name] - b[name]
            })
        },
        downsort(name) {
            this.rows.sort(function (a, b) {
                return b[name] - a[name]
            })
        },
        columnClick() {
            this.columnOptionsShow = !this.columnOptionsShow
        },
        columnHandler(handler, name) {
            this.columnOptionsShow = false
            switch (handler) {
                case 'upsort':
                    this.upsort(name);
                    break;

                case 'downsort':
                    this.downsort(name);
                    break;

                case 'deleteCols':
                    this.deleteCols(name);
                    break;

            }
        }

    }

})