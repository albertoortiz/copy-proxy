var copyWorker = require('./../worker/copyWorker').insertInQ;
var merge = require('./../worker/merge');
var sinon = require('sinon');
var should = require('should');

describe('Request to download chunk', function() {

    var newJob = {};
    var callToMerge;

    before(function() {
        callToMerge = sinon.stub(merge, 'callToMerge');
    });


    // TODO remove this error from here and use it with Rabbit connection/channel
    // http://stackoverflow.com/questions/19461234/domains-not-properly-catching-errors-while-testing-nodejs-in-mocha
    //it('Error is thrown and domain take it ... ', function(done) {
    //    callToMerge.onCall(0).throws(new Error('Test disconnection error'));
    //    newJob.numChunks = 0;
    //    process.nextTick(function() {
    //        copyWorker.exec(JSON.stringify(newJob));
    //        return done();  // don't end execution
    //    });
    //});

    it('it should not call to merge with a valid num for chunks', function(done) {
        copyWorker.exec(JSON.stringify(newJob));
        merge.callToMerge.called.should.be.equal(false);
        done();
    });

    it('it should call to merge', function(done) {
        newJob.numChunks = 0;
        copyWorker.exec(JSON.stringify(newJob));
        merge.callToMerge.called.should.be.equal(true);
        done();
    });

});