/**
 * Created by admin on 7/31/2017.
 */
var assert      = require('assert');
var moment      = require('moment');
var config      = require('../config');
var UserTrackHistoryRecord = require('../models/UserTrackHistoryRecord').UserTrackHistoryRecord;
module.exports = function(logger){
    module = {};

    module.AddNewUserTrackHistoryRecord = function(item){

        UserTrackHistoryRecord.create({
            date: item.date,
            artist: item.artist,
            track: item.track,
            username: item.username,
            uuid: item.uuid,
            battery: item.battery
        });
    };


    module.GetAllUserTrackHistoryRecords = function(username, callback){
        logger.info('GetAllUserTrackHistoryRecords for', username);
        var query = UserTrackHistoryRecord
            .find({'username' : username}).sort({ date : -1 });
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    };
    module.RemoveOldRecords = function () {
        var yesterdayDate = moment().subtract(config.userTrackHistoryTimeoutHours, 'hour').unix();
        UserTrackHistoryRecord
            .find({
                '$where': 'this.date <= ' + yesterdayDate
            })
            .remove()
            .exec(function(err, doc){
                if (err) console.log(err);
            });
    };

    return module;
}