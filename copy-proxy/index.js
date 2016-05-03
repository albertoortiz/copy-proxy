var logger = require('./logger');
var schedule = require('node-schedule');
var conf = require('./config');
var rp = require('request-promise');
var insert = require('./worker/copyWorker').insertInQ;

schedule.scheduleJob('torrent ask',{minute: new schedule.Range(0, 59, 1)}, function() {
    var options = conf.optionRequestFiles();
    logger.debug('request for files in SP ', options);
    rp(options)
        .then(function(response) {
            if (response.statusCode === 200) {
                var newJob = response.body.toString();
                logger.info(newJob);
                insert.exec(newJob);
            } else if (response.statusCode === 204) {
                logger.info("No torrents in the server ");
            } else {
                logger.error("Event not managed");
            }
        })
        .catch(function(err) {
            logger.error('Error asking for torrents in SP' , err);
        });
});
