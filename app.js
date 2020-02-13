var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config')
var auth = require('./routes/auth');
const proxy = require('express-http-proxy')
// const proxy = require('./routes/proxy')
const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', auth);
app.use((req, res, next) => { // Just do one thing: check token in the header; if exist, decode it and bind the userData on to request
  const token = req.headers['xtoken'];
  console.log(token)
  if (token) {
    jwt.verify(token, config.tokenSecret, function (err, userData) {
      if (!err) {
        console.log(userData)
        req.user = userData;
      }
      next();
    });
  }else{
    next()
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
          proxyReqOpts.headers['userInfo'] = srcReq.user
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
