       export function excelToJson(el) {
           var fgf = /\t/;
           var ctype = "0";
           var txt = el.val();
           var datas = txt.split("\n"); //换行符分开
           var html = "[\n";
           var keys = [];
           for (var i = 0; i < datas.length; i++) {
               var ds = datas[i].split(fgf); //制表符
               if (i == 0) {
                   //标题
                   if (ctype == "0") {
                       keys = ds;
                       console.log(keys)
                   } else {
                       html += "[";
                       for (var j = 0; j < ds.length; j++) {
                           html += '"' + ds[j] + '"';
                           if (j < ds.length - 1) {
                               html += ",";
                           }
                       }
                       html += "],\n";
                   }
               } else {
                   if (ds.length == 0)
                       continue;
                   if (ds.length == 1) {
                       ds[0] == "";
                       continue;
                   }
                   html += ctype == "0" ? "{" : "[";
                   for (var j = 0; j < ds.length; j++) {
                       var d = ds[j];
                       if (d == "")
                           continue;
                       if (ctype == "0") {
                           html += '"' + keys[j] + '":"' + d + '"';
                       } else {
                           html += '"' + d + '"';
                       }
                       if (j < ds.length - 1) {
                           html += ',';
                       }
                   }
                   html += ctype == "0" ? "}" : "]";
                   if (i < datas.length - 2)
                       html += ",\n";
               }
           }
           html += "\n]";
           console.log(html)
           var rows = JSON.parse(html),
               columns = keys;
           return {
               rows,
               columns
           }

       }