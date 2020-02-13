var express = require('express');
var app = express();
app.get('/orders/:orderNo', function (req, res) {
    var response = {
       orderNo:req.params.orderNo,
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