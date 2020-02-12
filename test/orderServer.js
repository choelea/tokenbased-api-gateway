var http = require('http');
var express = require('express');

var express = require('express');
var app = express();
app.get('/orders/202002100000', function (req, res) {
    response = {
       orderNo:'202002100000',
       amount:'100'
   };
   console.log(response);
   res.json(response)
})
var server = app.listen(4002, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})