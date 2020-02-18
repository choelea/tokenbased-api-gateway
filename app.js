var express = require('express');
var logger = require('morgan');
var {Buffer} = require('buffer');
var bodyParser = require('body-parser');
const config = require('./config')
var auth = require('./routes/auth');
var tokenStore = require('./storeStrategy');
const proxy = require('express-http-proxy')
// const proxy = require('./routes/proxy')
const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', auth);
app.use(function (req, res, next) {
  const token = req.headers['xtoken'];
  if (token) {
    tokenStore.verify(token, function (err, userData) {
      if (!err) {
          req.user = userData;
      }
      next();
    });
  } else {
      next();
  } 
});

const { isAuthenticated } = require('./middlewares/authenticator')
// app.use('/uapi', proxy('http://localhost:4001'))
if(config.resources){
  config.resources.forEach(element => {
    var myProxy = proxy(element.endpoint, {
      proxyReqPathResolver: (req) => {
        const path = req.originalUrl;
        if(element.stripPrefix){
          return path.replace(element.prefix, '');
        }else{
          return path;
        }        
      },
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if(srcReq.user){
          let buff = Buffer.from(JSON.stringify(srcReq.user), 'utf-8'); 
          proxyReqOpts.headers['userInfo'] = buff.toString('base64');
        }        
        return proxyReqOpts
      },
    });
    if(element.isAuthenticationNeeded){
      app.use(element.prefix, isAuthenticated, myProxy);
    }else{
      app.use(element.prefix, myProxy);
    }
  });
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json(err)
});

module.exports = app;
