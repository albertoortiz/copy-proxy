var winston = require('winston');
var moment = require('moment');

var consoleTransport = new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    handleExceptions: true,
    json: false,
    timestamp: function() {return moment().format('YYYY-MM-DD hh:mm:ss');},
    colorize: true
});

// Application logger
var logger = new winston.Logger({

    //transports: process.env.TEST_MODE_ENABLED ? [consoleTransport, fileTransport] : [fileTransport],
    transports: [consoleTransport],
    exitOnError: false
});


module.exports = logger;