var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const jwt    = require('jsonwebtoken');
var test = require('./routes/test');
var auth = require('./routes/auth');
var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', auth);

app.use((req, res, next) => {
  const chemToken = req.headers['chem-token'];
	if (chemToken) {
    jwt.verify(chemToken, 'secret-which-should-be-configured-in-another-file', function(err, userData) {		
      console.log(err)	
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				req.user = userData;	
				next();
			}
		});

	} else {
    return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});		
	}	
});

app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json(err)
});

module.exports = app;
