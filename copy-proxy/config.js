var remoteHostTransServer = '127.0.0.1';
var remoteHostFilesServerIP = process.argv[2];
var port1 = 8088;
var port2 = 8090;
var remoteHostFilesServerPort = 8088;
var remotePortTransServer = 8080;

var requestTimeOut = 1000 * 60 * 5; // 5 minutes

var configJSON = {};
configJSON.timeOutRequestMl = 500;
configJSON.timeToDestroyWorker = 1000 * 60; // wait 1' to restart

var remoteHostUpdatePath = remoteHostFilesServerIP;


module.exports = {
    optionsMergeReq: function() {
        return  {
            headers: {'content-type': 'application/json'},
            method: 'PUT',
            url: 'http://'+ remoteHostTransServer +':'+ remotePortTransServer + '/file/merge',
            body: undefined,
            timeout: requestTimeOut * 4 // 20 minutes
        };
    },
    
    updateOption: function(jobToMerge) {
        var remotePortUpdatePath = 8088;
        if (jobToMerge.port === 22) {
            remotePortUpdatePath = 8090;
        }
        return {
            headers: {'content-type': 'application/json'},
            method: 'PUT',
            url: 'http://' + remoteHostUpdatePath +':'+ remotePortUpdatePath + '/update/path',
            body: undefined,
            timeout: 1000 * 60 * 5 // 5 minutes
        };
    },
    
    optionsChuckReq: function() {
        return {
            headers: {'content-type': 'application/json'},
            method: 'POST',
            url: 'http://'+ remoteHostTransServer +':'+ remotePortTransServer + '/file/validator/cs',
            body: undefined,
            timeout: requestTimeOut
            //simple: false  // Get a rejection only if the request failed for technical reasons
        };
    },
    
    optionRequestFiles: function () {
        if (remoteHostFilesServerPort === port1) {
            remoteHostFilesServerPort = port2;
        } else {
            remoteHostFilesServerPort = port1;
        }
        
        return {
            resolveWithFullResponse: true,
            method: 'GET',
            url: 'http://'+ remoteHostFilesServerIP + ':'+ remoteHostFilesServerPort + '/list/files'
        };
    }
};