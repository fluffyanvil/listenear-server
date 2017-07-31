/**
 * Created by admin on 7/31/2017.
 */
var assert = require('assert');
var moment      = require('moment');
var UserTrackHistoryRecord = require('../models/UserTrackHistoryRecord').UserTrackHistoryRecord;
module.exports = {
    AddNewUserTrackHistoryRecord : function(item){
        UserTrackHistoryRecord.create({
            date: item.date,
            artist: item.artist,
            track: item.track,
            username: item.username,
            uuid: item.uuid,
            battery: item.battery
        });
    },
    GetAllUserTrackHistoryRecords: function(username, callback){
        var query = UserTrackHistoryRecord
            .find({'username' : username}).sort({ date : -1 });
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    },
    RemoveOldRecords : function () {
        var yesterdayDate = moment().subtract(24, 'hour').unix();
        UserTrackHistoryRecord
            .find({
                '$where': 'this.date <= ' + yesterdayDate
            })
            .remove()
            .exec(function(err, doc){
                if (err) console.log(err);
            });
    }
}