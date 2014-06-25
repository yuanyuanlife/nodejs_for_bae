var fs = require('fs'), request = require('request');
var sign = '你的签名字符串';

var MKDirIfNotExist = function(filePN){
  var dirArr = filePN.split('/'), cPath = '';
    for(var i = 0, len = dirArr.length; i < len; i ++){
      if(dirArr[i]) {
        cPath += dirArr[i];
        var exists = fs.existsSync(cPath);
        if(!exists){
          fs.mkdirSync(cPath);
        }
        cPath += '/';
     }
  }
}

request('http://bcs.duapp.com/<strong>你的bucket名</strong>?sign=<strong>你的签名字符串</strong>', function (error, response, body) {
  if (!error && response.statusCode == 200) {
        var bodyJSON = JSON.parse(body);
        for(var i = 0, len = bodyJSON.object_total; i < len; i ++){
           if(bodyJSON.object_list[i].is_dir == '0'){
                MKDirIfNotExist(bodyJSON.object_list[i].parent_dir);
                fs.openSync('./' + bodyJSON.object_list[i].object, "w");
                request('http://bcs.duapp.com/<strong>你的bucket名</strong>'+ bodyJSON.object_list[i].object + '?sign=' + sign).pipe(fs.createWriteStream('./' + bodyJSON.object_list[i].object));
        }}
  }
});
