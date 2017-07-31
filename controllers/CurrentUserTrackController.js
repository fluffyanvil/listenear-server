/**
 * Created by admin on 7/31/2017.
 */
var assert = require('assert');
var moment      = require('moment');
var CurrentUserTrack = require('../models/CurrentUserTrack').CurrentUserTrack;
var userTrackHistoryController = require('./UserTrackHistoryRecordController');

module.exports = {
    GetAllCurrentUserTracks: function(callback){
        var query = CurrentUserTrack
            .find({});
        var promise = query.exec();
        assert.ok(promise instanceof require('mpromise'));

        promise.then(function (doc) {
            callback(doc, null);
        });
    },

    RemoveOldRecords: function () {
        var curDate = moment().unix();
        CurrentUserTrack.find({
            '$where': curDate + '- this.date >= 3600'
        })
            .remove()
            .exec(function(err, doc){
                if (err) console.log(err);
            });
    },

    UpdateCurrentUserTrack: function(currentUserTrack, callback){
        CurrentUserTrack
            .findOneAndUpdate({
                username: currentUserTrack.username
            }, {
                date: moment().unix(),
                artist: currentUserTrack.artist,
                track: currentUserTrack.track,
                lat: currentUserTrack.lat,
                lng: currentUserTrack.lng,
                username: currentUserTrack.username,
                uuid: currentUserTrack.uuid,
                battery: currentUserTrack.battery
            }, {
                upsert : true,
                'new': true
            },
            function (error, result){
                if (error) callback(null, result);
                else{
                    userTrackHistoryController.AddNewUserTrackHistoryRecord(result);
                    callback(result, null);
                }
            });
    },
}