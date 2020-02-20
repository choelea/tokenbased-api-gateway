var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/users/0', function (req, res) {
    var response = {
       first_name:'Joe',
       last_name:'Li'
   };
   console.log(response);
   res.json(response)
})

app.post('/authenticate', function (req, res) {
    console.log(req.body)
    console.log(req.body.username == 'jiu-shu')
    if(req.body.username == 'jiu-shu' && req.body.password=='123456'){
        res.json({
            username:'jiu-shu',
            role:'admin'
        });
    }else{
        var msg = "用户名或者密码错误";
        res.status(400).json({msg})
    }
     
})  
var server = app.listen(4001, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})