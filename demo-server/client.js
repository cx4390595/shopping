/**
 * Created by hh on 2018/8/7
 */
let http = require('http');

let util = require('util');

http.get('https://www.imooc.com/lecturer/ajaxrecteacher',function (res) {
  let data = '';
  res.on("data",function (chunk) {
    data += chunk;
    console.log(data)
  })
  res.on('end',function () {
    let result = JSON.parse(data);

    util.
    console.log(result)
    console.log('result:'+result.msg)
  })
});
