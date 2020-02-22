const winston = require('winston')
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
        // eslint-disable-next-line no-undef
        level: process.env.LOGLEVEL || 'info',
        format: winston.format.simple(),
    })
} else {
    transport = new (winston.transports.Console)({ 
        timestamp: true, 
        level: 'info',
        format: winston.format.simple(),
    })
}

const winstonLogger = winston.createLogger({
    transports: [
        transport,
    ],
})

module.exports = function(fileName) {    
    var myLogger = {
        error: function(text) {
            winstonLogger.error(fileName + ': ' + text)
        },
        info: function(text) {
            winstonLogger.info(fileName + ': ' + text)
        },
        warn: function(text) {
            winstonLogger.warn(fileName + ': ' + text)
        }
    }

    return myLogger
}