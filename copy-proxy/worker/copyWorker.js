var events = require('events');
var util = require('util');
var rp = require('request-promise');
var conf = require('./../config');
var logger = require('./../logger');
var merge = require('./merge');
var domainJobExecution = require('domain').create();
var fs = require('fs');

var working = false;
var thereIsAnError = false;


function ReqChunk() {
    events.EventEmitter.call(this);
}
util.inherits(ReqChunk, events.EventEmitter);

var ProcessJobExecution = function(newJob, tasks) {

    // create chunk tasks
    if (typeof newJob.numChunks !== 'number') {
        working = false;
        return;
    }

    for (var i = 0; i < newJob.numChunks; i++) {
        var task = {};
        logger.info('Created task-chunk number ', i);
        task.id = i;
        task.path = newJob.path + (i + 1);
        task.name = newJob.fileName + (i + 1);
        task.host = newJob.host;
        task.port = newJob.port;
        tasks.push(task);
    }

    var taskWorker = new ReqChunk();

    taskWorker.on('startReqChuck', function() {
        var chuck = tasks.shift();
        if (typeof chuck == "undefined") { // no more tasks
            return taskWorker.emit('endChuck');
        }

        logger.info('Chunk to request %s', chuck.name);
        var chunkOpt = conf.optionsChuckReq();
        chunkOpt.body = JSON.stringify(chuck).toString();
        logger.info('Request chunk ', chunkOpt);
    });

    taskWorker.on('endChuck', function() {
        logger.info('endChuck - tasks.length= %s, thereIsAnError=%s, working=%s', tasks.length, thereIsAnError, working);
        if (tasks.length === 0 && !thereIsAnError) {
            merge.callToMerge(newJob);
        }
        setTimeout(function() {
            working = false;
            logger.info('Working =', working);
        }, 1000);
    });

    taskWorker.emit('startReqChuck');
};

domainJobExecution.on('error', function(err) {
    logger.error('domainJobExecution error: ' + err.message);
});

exports.insertInQ = {

    exec: function execFunc(msg) {
        if (!working) {
            working = true;
            var job = JSON.parse(msg);
            thereIsAnError = false;
            domainJobExecution.run(
                function() {
                    return new ProcessJobExecution(job, []);
                });
        }
    }
};