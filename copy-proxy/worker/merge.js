var rp = require('request-promise');
var logger = require('./../logger');
var conf = require('./../config');


module.exports = {

    callToMerge: function callToMergeFunc(jobToMerge) {

        var updateOption = conf.updateOption(jobToMerge);
        jobToMerge.status = 0;
        updateOption.body = JSON.stringify(jobToMerge).toString();
        logger.debug('jobToMerge update status in DB', updateOption);
        // immediately request to update the PATH just to avoid a new download
        rp.put(updateOption)
            .then(function(body) {
                return logger.info('Update path: ', body);
            })
            .catch(function(err) {
                return logger.error('Error Req update path: ', err.message);
            });


        logger.info('jobToMerge ', jobToMerge);
        var mergeRequestOpt = conf.optionsMergeReq();
        mergeRequestOpt.body = JSON.stringify(jobToMerge).toString();
        // conf.config().optionsMergeReq.body = JSON.stringify(jobToMerge).toString();
        // request to merge the file downloaded - update the status if fails
        rp.put(mergeRequestOpt/*conf.config().optionsMergeReq*/)
            .then(function(body) {
                return logger.info('Merge response %j', body);
            })
            .catch(function (err) {
                logger.error('Error calling merge ' + err.message);
                jobToMerge.status = 5; // some error while merging
                mergeRequestOpt.body = JSON.stringify(jobToMerge).toString();

                rp.put(mergeRequestOpt)
                    .then(function(body) {
                        logger.info('Resp updating path - status 2 %j', body);
                    }).catch(function (err) {
                        logger.error('Error Req Merge %j', err.message);
                    });
            });
    }
};