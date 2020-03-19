const winston = require('winston')
const { combine, timestamp,  json } = winston.format;
require('winston-daily-rotate-file')
const fs = require('fs')
var path = require("path");
// eslint-disable-next-line no-undef
var logDir = path.resolve('/var/log/apiproxy');
let transport;
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV == 'production') {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
    transport = new (winston.transports.DailyRotateFile)({
        filename: `${logDir}/app-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        timestamp:true,
        // eslint-disable-next-line no-undef
        level: process.env.LOGLEVEL || 'info',
        // format: winston.format.simple(),
    })
} else {
    transport = new (winston.transports.Console)({ 
        timestamp: true, 
        level: 'info',
        // format: winston.format.simple(),
    })
}
const winstonLogger = winston.createLogger({
    format: combine(
        timestamp(),
        json()
      ),
    transports: [
        transport,
    ],
})

module.exports = function(file) {
    var myLogger = {
        error: function(text) {
            winstonLogger.log({
                level: 'error',
                file,
                message: text,
              });
        },
        info: function(text) {
            winstonLogger.log({
                level: 'info',
                file,
                message: text,
              });
        },
        warn: function(text) {
            winstonLogger.log({
                level: 'warn',
                file,
                message: text,
              });
        }
    }

    return myLogger
}